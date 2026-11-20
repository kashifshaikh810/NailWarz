/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppColors from '../../../utils/AppColors';
import SaloonsCard from '../../../components/SaloonsCard';
import AppText from '../../../components/AppTextComps/AppText';
import moment from 'moment';
import AppButton from '../../../components/AppButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  cancelBookingStatus,
  getServiceById,
  payWithWallet,
} from '../../../GlobalFunctions';
import {ShowToast} from '../../../GlobalFunctions/auth';
import BookingDetailsModal from '../../../components/BookingDetailsModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../../GlobalFunctions/styles';
import {buildBookingServiceSelectionPayload} from '../../../utils/bookingSelectionPayload';
import {
  buildBookingPricingSummary,
  formatBookingCurrency,
  getDiscountDescriptor,
} from '../../../utils/bookingPricing';
import {useSelector} from 'react-redux';
import {formatPaymentMessageDateTimes} from '../../../utils/paymentMessages';

const flattenBookingValue = value => {
  if (Array.isArray(value)) {
    return value.reduce(
      (items, item) => [...items, ...flattenBookingValue(item)],
      [],
    );
  }

  return value ? [value] : [];
};

const getServiceDurationMinutes = service => {
  const rawDuration =
    service?.durationMinutes ||
    service?.duration ||
    service?.serviceDuration ||
    service?.service?.durationMinutes ||
    service?.service?.duration ||
    service?.service?.serviceDuration;
  const duration = Number(rawDuration);

  return Number.isFinite(duration) && duration > 0 ? duration : 30;
};

const getServiceItems = booking => {
  const newServices = flattenBookingValue(booking?.servicesDetail)
    .map(detail => {
      if (!detail || typeof detail !== 'object') {
        return null;
      }

      const scheduledAt = detail?.scheduledAt;
      const startMoment = scheduledAt ? moment(scheduledAt) : null;

      return {
        ...detail,
        slotId: detail?._id,
        serviceDetailId: detail?._id,
        appointmentServiceId: detail?._id,
        _id: detail?.service?._id || detail?._id,
        serviceName: detail?.serviceName || detail?.service?.serviceName,
        price: detail?.price ?? detail?.service?.price,
        status:
          detail?.status || detail?.serviceStatus || detail?.appointmentStatus,
        technician: detail?.technician,
        technicianId:
          detail?.service?.technicianId ||
          detail?.technicianId ||
          (detail?.technician ? [detail.technician] : []),
        startMoment: startMoment?.isValid() ? startMoment : null,
        durationMinutes: getServiceDurationMinutes(detail),
      };
    })
    .filter(Boolean);

  if (newServices.length) {
    return newServices;
  }

  const fallbackService = flattenBookingValue(booking?.serviceId).find(
    service => service && typeof service === 'object',
  );
  const fallbackTechnician = flattenBookingValue(booking?.technicianId).find(
    technician => technician && typeof technician === 'object',
  );
  const fallbackMoment = booking?.date
    ? moment(
        booking?.time ? `${booking.date} ${booking.time}` : booking.date,
        [
          moment.ISO_8601,
          'DD-MM-YYYY hh:mm A',
          'DD-MM-YYYY HH:mm',
          'DD-MM-YYYY',
          'YYYY-MM-DD',
        ],
        true,
      )
    : null;

  return fallbackService
    ? [
        {
          ...fallbackService,
          serviceName: fallbackService?.serviceName,
          price: fallbackService?.price,
          status: booking?.status,
          technician: fallbackTechnician,
          technicianId: fallbackService?.technicianId || booking?.technicianId,
          startMoment: fallbackMoment?.isValid() ? fallbackMoment : null,
          durationMinutes: 30,
        },
      ]
    : [];
};

const getBookingStartMoment = booking => {
  const moments = getServiceItems(booking)
    .map(service => service?.startMoment)
    .filter(Boolean);

  return moments.length
    ? moments.sort((a, b) => a.valueOf() - b.valueOf())[0]
    : null;
};

const isPaymentPending = booking => {
  return (
    booking?.status === 'PaymentPending' ||
    `${booking?.paymentStatus || ''}`.toLowerCase() === 'pending'
  );
};

const isExpiredBooking = booking => {
  return booking?.status === 'Expired';
};

const isWalletPaymentMethod = booking => {
  return `${booking?.paymentMethod || ''}`.toLowerCase() === 'wallet';
};

const isServiceRescheduled = service => {
  return service?.reschedule === true || service?.reschedule === 'true';
};

const getEntityId = value => {
  return value && typeof value === 'object' ? value?._id || value?.id : value;
};

const formatServiceStatus = status => {
  if (!status) {
    return null;
  }

  return `${status}`
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
};

const getServiceStatusStyle = status => {
  const normalizedStatus = `${status || ''}`.toLowerCase();

  if (normalizedStatus.includes('complete')) {
    return {
      container: styles.completedStatusPill,
      textColor: '#147A3D',
    };
  }

  if (normalizedStatus.includes('cancel')) {
    return {
      container: styles.canceledStatusPill,
      textColor: AppColors.BTNCOLOURS,
    };
  }

  if (normalizedStatus.includes('progress')) {
    return {
      container: styles.inProgressStatusPill,
      textColor: '#075985',
    };
  }

  return {
    container: styles.confirmedStatusPill,
    textColor: '#7A5A00',
  };
};

const BookingDetails = ({navigation, route}) => {
  const {data} = route?.params;
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedRescheduleService, setSelectedRescheduleService] =
    useState(null);
  const [payingWithWallet, setPayingWithWallet] = useState(false);
  const [showWalletConfirmation, setShowWalletConfirmation] = useState(false);
  const [walletPaymentErrorModal, setWalletPaymentErrorModal] = useState({
    visible: false,
    message: '',
  });
  const {token} = useSelector(state => state?.user);
  const refRBSheet = useRef();
  const refRescheduleRBSheet = useRef();
  const refEntireRescheduleBSheet = useRef();
  const [bookingStatus, setBookingStatus] = useState(data?.status);
  const momentDay = moment().day();
  const index = momentDay === 0 ? 6 : momentDay - 1;
  console.log('data=====', data);
  const serviceItems = getServiceItems(data);
  const serviceDetails = serviceItems[0];
  const isCanceledBooking = `${bookingStatus}`.toLowerCase().includes('cancel');
  const pricingSummary = buildBookingPricingSummary({
    booking: data,
    serviceItems,
  });
  const walletCreditAmount = data?.totalAmount;
  const bookingStartMoment = getBookingStartMoment(data);
  const isPendingPayment = isPaymentPending(data);
  const isExpired = isExpiredBooking(data);
  const canPayNow =
    isPendingPayment &&
    !isExpired &&
    bookingStartMoment?.isValid() &&
    moment().isBefore(bookingStartMoment);
  const canShowBookingActions =
    !isCanceledBooking && !isPendingPayment && !isExpired;
  const canCancelBooking =
    canShowBookingActions &&
    bookingStartMoment?.isValid() &&
    moment().isSameOrBefore(bookingStartMoment.clone().subtract(1, 'hour'));
  const canRescheduleService = service => {
    return (
      canShowBookingActions &&
      !isServiceRescheduled(service) &&
      service?.startMoment?.isValid() &&
      service.startMoment.diff(moment(), 'hours', true) >= 12
    );
  };
  const canRescheduleEntireBooking =
    canShowBookingActions &&
    data?.isEntireBookingRescheduled !== true &&
    serviceItems.length >= 2 &&
    serviceItems.every(canRescheduleService);
  const formatServiceSchedule = service => {
    if (!service?.startMoment?.isValid()) {
      return 'Date not available';
    }

    const endMoment = service.startMoment
      .clone()
      .add(service.durationMinutes, 'minutes');

    return `${service.startMoment.format('ddd, MMM D')} • ${service.startMoment.format('h:mm A')} - ${endMoment.format('h:mm A')}`;
  };
  const goBackToBookings = () => {
    const bookingRoute = {name: 'Booking', params: {initialTab: 'Canceled'}};
    const parentNavigation = navigation.getParent?.();

    if (parentNavigation) {
      parentNavigation.navigate('Booking', {
        screen: 'Booking',
        params: {initialTab: 'Canceled'},
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [bookingRoute],
    });
  };
  const handleBackPress = () => {
    if (isCanceledBooking) {
      goBackToBookings();
      return;
    }

    navigation.goBack();
  };

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const response = await cancelBookingStatus(data?._id);
      console.log('response', response);
      setCancelLoading(false);
      if (response?.success) {
        refRBSheet.current.close();
        setBookingStatus('Canceled');
        ShowToast('success', 'Booking canceled successfully');
      } else {
        ShowToast('error', response?.message);
      }
    } catch (err) {
      setCancelLoading(false);
      ShowToast('error', err?.response?.data?.message);
    }
  };
  const handleExpiredRebook = () => {
    const salonId = data?.salonId?._id || data?.salonId;

    if (!salonId || !serviceItems.length) {
      return ShowToast('error', 'Unable to prepare this booking again.');
    }

    navigation.navigate('HomeDetails', {
      saloonId: salonId,
      preselectedServices: serviceItems,
      rebookMeta: {
        expiredBookingId: data?._id,
        isExpiredRebook: true,
      },
    });
  };
  const navigateToCardPayment = () => {
    navigation.navigate('SelectPaymentMethod', {
      bookingId: data?._id,
      salonId: data?.salonId?._id || data?.salonId,
      price: data?.totalAmount,
      pay: true,
      serviceDetail: data?.servicesDetail,
    });
  };

  const handlePendingPayment = () => {
    if (!isWalletPaymentMethod(data)) {
      navigateToCardPayment();
      return;
    }

    setShowWalletConfirmation(true);
  };

  const executeWalletPayment = async () => {
    if (payingWithWallet) {
      return;
    }

    setShowWalletConfirmation(false);
    setPayingWithWallet(true);
    try {
      console.log('BookingDetails payWithWallet request:', {
        bookingId: data?._id,
        paymentMethod: data?.paymentMethod,
      });
      const response = await payWithWallet(data?._id, token);
      console.log('BookingDetails payWithWallet response:', response);

      if (response?.success) {
        ShowToast('success', response?.message || 'Payment successful');
        navigation.navigate('Booking', {
          initialTab: 'Confirmed',
        });
        return;
      }

      setWalletPaymentErrorModal({
        visible: true,
        message:
          formatPaymentMessageDateTimes(response?.message) ||
          'We could not process your wallet payment. Please try again.',
      });
    } catch (error) {
      console.log(
        'BookingDetails payWithWallet error:',
        error?.response?.data || error?.message || error,
      );
      setWalletPaymentErrorModal({
        visible: true,
        message:
          formatPaymentMessageDateTimes(
            error?.response?.data?.message || error?.message,
          ) || 'We could not process your wallet payment. Please try again.',
      });
    } finally {
      setPayingWithWallet(false);
    }
  };
  const openServiceReschedule = service => {
    const slotId = getSlotIdForService(service);
    console.log('RESCHEDULE_BUTTON_PRESS_PAYLOAD', {
      bookingId: data?._id,
      slotId,
      serviceId: service?._id,
      serviceName: service?.serviceName,
      price: service?.price,
      currentScheduledAt: service?.scheduledAt,
      currentScheduledAtLocal: service?.startMoment?.isValid()
        ? service.startMoment.format('YYYY-MM-DD hh:mm A')
        : null,
      currentTechnicianId: getEntityId(service?.technician),
      currentTechnicianName: service?.technician?.fullName,
      rescheduleBookingDate: service?.startMoment?.isValid()
        ? service.startMoment.format('DD-MM-YYYY')
        : null,
    });
    console.log('BookingDetails reschedule pressed:', {
      bookingId: data?._id,
      bookingStatus,
      salonId: data?.salonId?._id,
      totalAmount: data?.totalAmount,
      paymentStatus: data?.paymentStatus,
      selectedService: service,
      selectedServiceIds: {
        serviceId: service?._id,
        serviceDetailId: service?.serviceDetailId,
        appointmentServiceId: service?.serviceDetailId || service?._id,
      },
      selectedServiceSchedule: {
        scheduledAt: service?.scheduledAt,
        startLocal: service?.startMoment?.isValid()
          ? service.startMoment.format('YYYY-MM-DD hh:mm A')
          : null,
        startUTC: service?.startMoment?.isValid()
          ? service.startMoment.clone().utc().format()
          : null,
        durationMinutes: service?.durationMinutes,
      },
      bookedTechnicianId: getEntityId(service?.technician),
      availableTechnicianCount: getServiceTechnicians(service).length,
    });
    setSelectedRescheduleService(service);
    refRescheduleRBSheet.current.open();
  };
  const getServiceTechnicians = service => {
    const technicianCandidates = [
      ...flattenBookingValue(service?.service?.technicianId),
      ...flattenBookingValue(service?.technicianId),
      service?.technician,
    ].filter(Boolean);
    const techniciansById = new Map();

    technicianCandidates.forEach(technician => {
      const technicianId =
        typeof technician === 'object'
          ? technician?._id || technician?.id
          : technician;

      if (!technicianId) {
        return;
      }

      const existingTechnician = techniciansById.get(technicianId);
      const shouldReplaceWithObject =
        typeof technician === 'object' && typeof existingTechnician !== 'object';

      if (!existingTechnician || shouldReplaceWithObject) {
        techniciansById.set(technicianId, technician);
      }
    });

    const technicians = Array.from(techniciansById.values());

    console.log('BookingDetails service technicians for reschedule:', {
      serviceId: service?._id,
      serviceName: service?.serviceName,
      candidateCount: technicianCandidates.length,
      resolvedCount: technicians.length,
      technicians,
    });

    return technicians;
  };
  const getSlotIdForService = service => {
    const existingSlotId =
      service?.slotId ||
      service?.serviceDetailId ||
      service?.appointmentServiceId;

    if (existingSlotId) {
      return existingSlotId;
    }

    const serviceId = service?._id || service?.service?._id;
    const scheduledAt = service?.scheduledAt;
    const matchedServiceDetail = flattenBookingValue(data?.servicesDetail).find(
      detail => {
        const detailServiceId = detail?.service?._id || detail?.service;
        const sameService = serviceId && detailServiceId === serviceId;
        const sameSchedule =
          !scheduledAt ||
          !detail?.scheduledAt ||
          detail.scheduledAt === scheduledAt;

        return sameService && sameSchedule;
      },
    );

    return matchedServiceDetail?._id || matchedServiceDetail?.slotId;
  };
  const getServiceWithAvailableTechnicians = async service => {
    const currentTechnicians = getServiceTechnicians(service);
    const serviceId = service?._id || service?.service?._id;

    if (!serviceId) {
      return {
        ...service,
        technicians: currentTechnicians,
      };
    }

    try {
      const response = await getServiceById(serviceId);
      const refreshedService = response?.data;
      const refreshedTechnicians = getServiceTechnicians(refreshedService);

      console.log('BookingDetails getServiceById for reschedule:', {
        serviceId,
        success: response?.success,
        currentTechnicianCount: currentTechnicians.length,
        refreshedTechnicianCount: refreshedTechnicians.length,
        technicianIds: refreshedTechnicians.map(getEntityId),
      });

      if (refreshedService && refreshedTechnicians.length) {
        return {
          ...service,
          _id: refreshedService?._id || service?._id,
          serviceName: refreshedService?.serviceName || service?.serviceName,
          price: refreshedService?.price ?? service?.price,
          categoryId: refreshedService?.categoryId || service?.categoryId,
          salonId: refreshedService?.salonId || service?.salonId,
          slotId: service?.slotId || service?.serviceDetailId,
          serviceDetailId: service?.slotId || service?.serviceDetailId,
          appointmentServiceId:
            service?.slotId ||
            service?.appointmentServiceId ||
            service?.serviceDetailId,
          technicianId: refreshedTechnicians,
          technicians: refreshedTechnicians,
        };
      }
    } catch (error) {
      console.log('BookingDetails getServiceById failed for reschedule:', {
        serviceId,
        error: error?.response?.data || error?.message,
      });
    }

    return {
      ...service,
      technicians: currentTechnicians,
    };
  };
  console.log('data====', data);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(10),
          backgroundColor: AppColors.WHITE,
        }}>
        <View>
          <AppHeader
            isLogo
            style={{paddingBottom: responsiveHeight(2)}}
            onPress={handleBackPress}
            title="Bookings"
          />
          <View style={{padding: responsiveHeight(2)}}>
            <SaloonsCard
              saloonId={data?.salonId?._id}
              title={data?.salonId?.salonName}
              KM={'2'}
              Rating={data?.salonId?.avgRating}
              TotalNoOfRating={data?.salonId?.totalReviews}
              img={data?.salonId?.image[0]}
              location={data?.salonId?.locationName}
              workingDays={data?.salonId?.workingDays[index]}
              itemId={data?._id}
              // isShowDeleteIcon={isShowDeleteIcon}
              // setIsShowDeleteIcon={setIsShowDeleteIcon}
              // setShowRemoveModal={setShowRemoveModal}
            />
            <AppText
              title={
                isCanceledBooking
                  ? 'Canceled Booking Details'
                  : 'Booking Details'
              }
              textColor={AppColors.BLACK}
              textSize={2.5}
              mrgnTop={2}
              textFontWeight
            />
            <AppText
              title="Date"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            <AppText
              title={
                bookingStartMoment?.isValid()
                  ? bookingStartMoment.format('ddd, MMM D')
                  : 'Date not available'
              }
              textColor="#939393"
              textSize={1.9}
              mrgnTop={1}
            />
            <AppText
              title="Scheduled Services"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            <View style={{marginTop: responsiveHeight(1), gap: responsiveHeight(1)}}>
              {serviceItems.length ? (
                serviceItems.map((service, serviceIndex) => (
                  <View
                    key={`${service?._id || service?.serviceName}-${serviceIndex}`}
                    style={styles.serviceDetailCard}>
                    <View style={{flex: 1, paddingRight: responsiveWidth(2)}}>
                      <AppText
                        title={service?.serviceName || 'Service'}
                        textColor={AppColors.BLACK}
                        textSize={1.9}
                        textFontWeight
                        numberOfLines={2}
                      />
                      <AppText
                        title={[
                          service?.technician?.fullName || 'Technician not assigned',
                          formatServiceSchedule(service),
                        ].join(' • ')}
                        textColor="#939393"
                        textSize={1.65}
                        mrgnTop={0.5}
                      />
                      <View style={styles.serviceActionsRow}>
                        {canRescheduleService(service) ? (
                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => openServiceReschedule(service)}
                            style={styles.reschedulePill}>
                            <AppText
                              title="Reschedule"
                              textSize={1.35}
                              textColor={AppColors.BTNCOLOURS}
                              textFontWeight
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.serviceMetaColumn}>
                      <AppText
                      title={formatBookingCurrency(service?.price)}
                        textColor={AppColors.DARKGRAY}
                        textSize={1.8}
                        textFontWeight
                      />
                      {formatServiceStatus(service?.status) ? (
                        <View
                          style={[
                            styles.serviceStatusPill,
                            getServiceStatusStyle(service?.status).container,
                          ]}>
                          <AppText
                            title={formatServiceStatus(service?.status)}
                            textSize={1.2}
                            textColor={
                              getServiceStatusStyle(service?.status).textColor
                            }
                            textFontWeight
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))
              ) : (
                <AppText
                  title="No service details available"
                  textColor="#939393"
                  textSize={1.8}
                />
              )}
            </View>
            <View
              style={{
                marginTop: responsiveHeight(2),
                gap: responsiveHeight(4),
              }}>
              <View
                style={{
                  height: 1.5,
                  width: '100%',
                  backgroundColor: AppColors.WHITE2,
                }}
              />
              <View
                style={{
                  height: 1.5,
                  width: '100%',
                  backgroundColor: AppColors.WHITE2,
                }}
              />
            </View>
            <AppText
              title="Pricing Details"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            {serviceItems.map((service, priceIndex) => (
              <View
                key={`price-${service?._id || priceIndex}`}
                style={styles.priceRow}>
                <AppText
                  title={service?.serviceName || 'Service'}
                  textColor={AppColors.DARKGRAY}
                  textSize={2}
                  numberOfLines={1}
                  styles={{flex: 1, paddingRight: responsiveWidth(2)}}
                />
                <AppText
                  title={formatBookingCurrency(service?.price)}
                  textColor={AppColors.DARKGRAY}
                  textSize={2}
                />
              </View>
            ))}
            <View style={styles.priceRow}>
              <AppText
                title="Services Subtotal"
                textColor={AppColors.DARKGRAY}
                textSize={2}
                numberOfLines={1}
                styles={{flex: 1, paddingRight: responsiveWidth(2)}}
              />
              <AppText
                title={formatBookingCurrency(pricingSummary.subtotal)}
                textColor={AppColors.DARKGRAY}
                textSize={2}
              />
            </View>
            <View style={styles.priceRow}>
              <AppText
                title="Platform Charges"
                textColor={AppColors.DARKGRAY}
                textSize={2}
                numberOfLines={1}
                styles={{flex: 1, paddingRight: responsiveWidth(2)}}
              />
              <AppText
                title={formatBookingCurrency(pricingSummary.appCharges)}
                textColor={AppColors.DARKGRAY}
                textSize={2}
              />
            </View>
            {pricingSummary.discountAmount > 0 ? (
              <View style={[styles.priceRow, {alignItems: 'flex-start'}]}>
                <View style={{flex: 1, paddingRight: responsiveWidth(2)}}>
                  <AppText
                    title="Nail Warz Discount"
                    textColor="#147A3D"
                    textSize={2}
                    numberOfLines={1}
                  />
                  <AppText
                    title={getDiscountDescriptor(
                      pricingSummary.discountDetails,
                    )}
                    textColor="#147A3D"
                    textSize={1.35}
                    mrgnTop={0.25}
                    numberOfLines={1}
                  />
                </View>
                <AppText
                  title={`-${formatBookingCurrency(
                    pricingSummary.discountAmount,
                  )}`}
                  textColor="#147A3D"
                  textSize={2}
                />
              </View>
            ) : null}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText
                title="Total"
                textColor={AppColors.BLACK}
                textSize={2.2}
                mrgnTop={1.5}
                textFontWeight
              />
              <AppText
                title={formatBookingCurrency(pricingSummary.totalAmount)}
                textColor={AppColors.BLACK}
                textSize={2.2}
                mrgnTop={1.5}
                textFontWeight
              />
            </View>
            {isPendingPayment && !isExpired ? (
              <View style={styles.paymentStatusBox}>
                <AppText
                  title="Payment Pending"
                  textColor={AppColors.BTNCOLOURS}
                  textSize={1.9}
                  textFontWeight
                />
                <AppText
                  title={
                    canPayNow
                      ? 'Complete payment within 15 minutes to keep this booking active.'
                      : 'Payment was not completed within the 15-minute window.'
                  }
                  textColor="#7A5A00"
                  textSize={1.55}
                  mrgnTop={0.5}
                />
                {canPayNow ? (
                  <View style={{marginTop: responsiveHeight(1.4)}}>
                    <AppButton
                      title={
                        isWalletPaymentMethod(data)
                          ? 'Pay With Wallet'
                          : 'Pay Now'
                      }
                      disabled={payingWithWallet}
                      isLoading={payingWithWallet}
                      handlePress={handlePendingPayment}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
            {isCanceledBooking ? (
              <View
                style={{
                  backgroundColor: '#FDF1F1',
                  borderColor: '#F4B4B4',
                  borderWidth: 1,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: responsiveHeight(2),
                  paddingHorizontal: responsiveHeight(1.5),
                  paddingVertical: responsiveHeight(1.4),
                }}>
                <AppText
                  title="Balance Added to Wallet"
                  textColor={AppColors.BTNCOLOURS}
                  textSize={2}
                  textFontWeight
                />
                <AppText
                  title={formatBookingCurrency(walletCreditAmount)}
                  textColor={AppColors.BTNCOLOURS}
                  textSize={2.1}
                  textFontWeight
                />
              </View>
            ) : null}
            {isExpired ? (
              <View style={styles.expiredRebookSection}>
                <View style={{flex: 1, paddingRight: responsiveWidth(3)}}>
                  <AppText
                    title="Booking expired"
                    textColor={AppColors.BTNCOLOURS}
                    textSize={1.9}
                    textFontWeight
                  />
                  <AppText
                    title="Payment was not completed in time. Choose a new appointment to book again."
                    textColor="#7A5A00"
                    textSize={1.5}
                    mrgnTop={0.4}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleExpiredRebook}
                  style={styles.expiredRebookButton}>
                  <AppText
                    title="Rebook"
                    textColor={AppColors.WHITE}
                    textSize={1.55}
                    textFontWeight
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {canRescheduleEntireBooking ? (
              <View style={{marginTop: responsiveHeight(2.5)}}>
                <AppButton
                  title="Reschedule Entire Appointment"
                  handlePress={() => refEntireRescheduleBSheet.current.open()}
                  bgColor={AppColors.BTNCOLOURS}
                  textColor={AppColors.WHITE}
                />
              </View>
            ) : null}
            {canCancelBooking ? (
              <View
                style={{
                  marginTop: responsiveHeight(canRescheduleEntireBooking ? 1.5 : 4),
                }}>
                <AppButton
                  title="Cancel Booking"
                  handlePress={() => refRBSheet.current.open()}
                  bgColor={AppColors.WHITE}
                  textColor={AppColors.BTNCOLOURS}
                  borderWidth={2}
                  borderColor={AppColors.BTNCOLOURS}
                />
              </View>
            ) : null}
          </View>
          <RBSheet
            ref={refRBSheet}
            height={400}
            draggable={true}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
            enablePanDownToClose={true}>
            <BookingDetailsModal
              handleBtn1Press={handleCancelBooking}
              handleBtn2Press={() => refRBSheet.current.close()}
              heading="Cancel This Booking?"
              btn1Title={
                cancelLoading ? (
                  <ActivityIndicator
                    size={'large'}
                    color={AppColors.BTNCOLOURS}
                  />
                ) : (
                  'Yes, Cancel Booking'
                )
              }
              btn2Title="Keep Appointment"
            />
          </RBSheet>
          <RBSheet
            ref={refRescheduleRBSheet}
            height={400}
            draggable={true}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
            enablePanDownToClose={true}>
            <BookingDetailsModal
              handleBtn1Press={async () => {
                refRescheduleRBSheet.current.close();
                const serviceToReschedule =
                  selectedRescheduleService || serviceDetails;
                const slotId = getSlotIdForService(serviceToReschedule);
                const rescheduleServiceInput =
                  await getServiceWithAvailableTechnicians(
                    serviceToReschedule,
                  );
                const rescheduleServiceWithSlot = {
                  ...rescheduleServiceInput,
                  slotId,
                  serviceDetailId: slotId,
                  appointmentServiceId: slotId,
                };
                const rescheduleRoutePayload =
                  buildBookingServiceSelectionPayload({
                    salonId: data?.salonId?._id,
                    services: [rescheduleServiceWithSlot],
                    isMultiService: false,
                    reschedule: true,
                    myBookingId: data?._id,
                    originalDate: serviceToReschedule?.startMoment?.isValid()
                      ? serviceToReschedule.startMoment.format(
                          'ddd, MMM D [at] h:mm A',
                        )
                      : 'Original date not available',
                    extra: {
                      defaultTechnicianId: getEntityId(
                        serviceToReschedule?.technician,
                      ),
                      rescheduleBookingDate:
                        serviceToReschedule?.startMoment?.isValid()
                          ? serviceToReschedule.startMoment.format(
                              'DD-MM-YYYY',
                            )
                          : null,
                    },
                  });

                console.log('RESCHEDULE_TO_STYLIST_SELECT_DATA', {
                  bookingId: data?._id,
                  salonId: data?.salonId?._id,
                  inputService: {
                    serviceId: rescheduleServiceWithSlot?._id,
                    slotId: rescheduleServiceWithSlot?.slotId,
                    serviceDetailId: rescheduleServiceWithSlot?.serviceDetailId,
                    appointmentServiceId:
                      rescheduleServiceWithSlot?.appointmentServiceId,
                    serviceName: rescheduleServiceWithSlot?.serviceName,
                    price: rescheduleServiceWithSlot?.price,
                    scheduledAt: rescheduleServiceWithSlot?.scheduledAt,
                    technicianCount:
                      rescheduleServiceWithSlot?.technicians?.length || 0,
                    technicianIds: rescheduleServiceWithSlot?.technicians?.map(
                      technician => technician?._id || technician?.id,
                    ),
                    defaultTechnicianId: getEntityId(
                      serviceToReschedule?.technician,
                    ),
                  },
                  routeData: rescheduleRoutePayload,
                });

                navigation.navigate('StylistSelect', {
                  data: rescheduleRoutePayload,
                });
              }}
              isCancelModal={false}
              handleBtn2Press={() => refRescheduleRBSheet.current.close()}
              heading="Reschedule This Booking?"
              btn1Title="Yes, Reschedule"
              btn2Title="Keep Appointment"
            />
          </RBSheet>
          <RBSheet
            ref={refEntireRescheduleBSheet}
            height={400}
            draggable={true}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
            enablePanDownToClose={true}>
            <BookingDetailsModal
              handleBtn1Press={async () => {
                refEntireRescheduleBSheet.current.close();
                const allServicesWithTechnicians = await Promise.all(
                  serviceItems.map(service =>
                    getServiceWithAvailableTechnicians(service),
                  ),
                );
                const servicesWithSlots = allServicesWithTechnicians.map(
                  service => {
                    const slotId = getSlotIdForService(service);
                    return {
                      ...service,
                      slotId,
                      serviceDetailId: slotId,
                      appointmentServiceId: slotId,
                    };
                  },
                );
                const reschedulePayload =
                  buildBookingServiceSelectionPayload({
                    salonId: data?.salonId?._id,
                    services: servicesWithSlots,
                    isMultiService: true,
                    reschedule: true,
                    myBookingId: data?._id,
                    originalDate: bookingStartMoment?.isValid()
                      ? bookingStartMoment.format('ddd, MMM D [from] h:mm A')
                      : 'Original date not available',
                    extra: {
                      source: 'bookAgain',
                      rescheduleEntireBooking: true,
                      rescheduleDefaultDate: bookingStartMoment?.isValid()
                        ? bookingStartMoment.format('DD-MM-YYYY')
                        : null,
                    },
                  });

                console.log(
                  'RESCHEDULE_ENTIRE_BOOKING_TO_STYLIST_SELECT',
                  reschedulePayload,
                );

                navigation.navigate('StylistSelect', {
                  data: reschedulePayload,
                });
              }}
              isCancelModal={false}
              handleBtn2Press={() =>
                refEntireRescheduleBSheet.current.close()
              }
              heading="Reschedule All Services?"
              btn1Title="Yes, Reschedule All"
              btn2Title="Keep Appointment"
            />
          </RBSheet>
        </View>
      </ScrollView>
      <ConfirmationModal
        iconName="questioncircle"
        title="Pay With Wallet?"
        subTitle="Are you sure you want to complete this payment using your Nail Warz wallet?"
        buttonOneTitle="Pay With Wallet"
        buttonTwoTitle="Cancel"
        isChangeColor
        visible={showWalletConfirmation}
        setVisible={executeWalletPayment}
        handleBackPress={() => setShowWalletConfirmation(false)}
      />
      <ConfirmationModal
        iconName="close"
        title="Payment Could Not Be Completed"
        subTitle={walletPaymentErrorModal.message}
        buttonOneTitle="OK"
        visible={walletPaymentErrorModal.visible}
        setVisible={() =>
          setWalletPaymentErrorModal({visible: false, message: ''})
        }
      />
    </SafeAreaView>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  serviceDetailCard: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    backgroundColor: '#FCFCFC',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceMetaColumn: {
    alignItems: 'flex-end',
    marginLeft: responsiveWidth(1),
    maxWidth: responsiveWidth(26),
  },
  serviceStatusPill: {
    marginTop: responsiveHeight(0.7),
    borderRadius: 999,
    paddingHorizontal: responsiveWidth(2.2),
    paddingVertical: responsiveHeight(0.35),
  },
  confirmedStatusPill: {
    backgroundColor: '#FFF8E6',
  },
  inProgressStatusPill: {
    backgroundColor: '#EAF6FF',
  },
  completedStatusPill: {
    backgroundColor: '#EAF8EF',
  },
  canceledStatusPill: {
    backgroundColor: '#FFF4F4',
  },
  paymentStatusBox: {
    borderWidth: 1,
    borderColor: '#F3D38B',
    borderRadius: 10,
    backgroundColor: '#FFF8E6',
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
  },
  expiredRebookSection: {
    borderWidth: 1,
    borderColor: '#F3D38B',
    borderRadius: 10,
    backgroundColor: '#FFF8E6',
    marginTop: responsiveHeight(2.2),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiredRebookButton: {
    backgroundColor: AppColors.BTNCOLOURS,
    borderRadius: 8,
    minWidth: responsiveWidth(24),
    minHeight: responsiveHeight(4.6),
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(1.3),
  },
  serviceActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  reschedulePill: {
    borderWidth: 1,
    borderColor: AppColors.BTNCOLOURS,
    borderRadius: 999,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.55),
    backgroundColor: '#FFF4F4',
  },
});
