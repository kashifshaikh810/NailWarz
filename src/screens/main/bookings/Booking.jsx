/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';
import BookingCard from '../../../components/BookingCard';
import CancelBookingModal from '../../../components/CancelBookingModal';
import BookingCanceledModal from '../../../components/BookingCanceledModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {
  getBookingsByIdAndStatus,
  payWithWallet,
} from '../../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../../GlobalFunctions/auth';
import moment from 'moment';
import {buildBookingServiceSelectionPayload} from '../../../utils/bookingSelectionPayload';
import {
  getAccountReviewMessage,
  isAccountUnderReview,
} from '../../../utils/accountReviewRestriction';
import {formatPaymentMessageDateTimes} from '../../../utils/paymentMessages';

const APPOINTMENT_STATUS = {
  PAYMENT_PENDING: 'PaymentPending',
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  IN_PROGRESS: 'In_Progress',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
  EXPIRED: 'Expired',
};

const tabs = [
  {
    id: 1,
    title: 'Payment Pending',
    status: APPOINTMENT_STATUS.PAYMENT_PENDING,
    bookingType: 'payment_pending',
  },
  {
    id: 2,
    title: 'Confirmed',
    status: APPOINTMENT_STATUS.CONFIRMED,
    bookingType: 'up_coming',
  },
  {
    id: 3,
    title: 'Rescheduled',
    status: APPOINTMENT_STATUS.RESCHEDULED,
    bookingType: 'up_coming',
  },
  {
    id: 4,
    title: 'In Progress',
    status: APPOINTMENT_STATUS.IN_PROGRESS,
    bookingType: 'up_coming',
  },
  {
    id: 5,
    title: 'Completed',
    status: APPOINTMENT_STATUS.COMPLETED,
    bookingType: 'completed',
  },
  {
    id: 6,
    title: 'Canceled',
    status: APPOINTMENT_STATUS.CANCELED,
    bookingType: 'canceled',
  },
  {
    id: 7,
    title: 'Expired',
    status: APPOINTMENT_STATUS.EXPIRED,
    bookingType: 'expired',
  },
];

const normalizeBookingTab = tab => {
  if (!tab) {
    return 'Payment Pending';
  }

  if (tab === 'Accepted') {
    return 'Confirmed';
  }

  if (tab === 'In_Progress') {
    return 'In Progress';
  }

  if (tab === APPOINTMENT_STATUS.PAYMENT_PENDING) {
    return 'Payment Pending';
  }

  if (tab === APPOINTMENT_STATUS.EXPIRED) {
    return 'Expired';
  }

  return tab;
};

const flattenBookingValue = value => {
  if (Array.isArray(value)) {
    return value.reduce(
      (items, item) => [...items, ...flattenBookingValue(item)],
      [],
    );
  }

  return value ? [value] : [];
};

const parseBookingDateTime = (date, time) => {
  if (!date) {
    return null;
  }

  const dateFormats = [
    moment.ISO_8601,
    'DD-MM-YYYY hh:mm A',
    'DD-MM-YYYY HH:mm',
    'DD-MM-YYYY',
    'YYYY-MM-DD',
  ];
  const value = time ? `${date} ${time}` : date;
  const parsed = moment(value, dateFormats, true);

  return parsed.isValid() ? parsed : null;
};

const getServiceDetails = booking => {
  const newServices = flattenBookingValue(booking?.servicesDetail)
    .map(detail => {
      if (!detail || typeof detail !== 'object') {
        return null;
      }

      return {
        ...detail,
        slotId: detail?.slotId || detail?._id,
        serviceDetailId: detail?.slotId || detail?._id,
        appointmentServiceId: detail?.slotId || detail?._id,
        _id: detail?.service?._id || detail?.service || detail?._id,
        serviceName: detail?.serviceName || detail?.service?.serviceName,
        price: detail?.price ?? detail?.service?.price,
        technicianId: detail?.technician
          ? [detail.technician]
          : detail?.service?.technicianId,
      };
    })
    .filter(Boolean);

  if (newServices.length) {
    return newServices;
  }

  return flattenBookingValue(booking?.serviceId).filter(
    service => service && typeof service === 'object',
  );
};

const withServiceDetailSlotIds = booking => ({
  ...booking,
  servicesDetail: flattenBookingValue(booking?.servicesDetail).map(detail => {
    if (!detail || typeof detail !== 'object') {
      return detail;
    }

    return {
      ...detail,
      slotId: detail?.slotId || detail?._id,
      serviceDetailId: detail?.slotId || detail?._id,
      appointmentServiceId: detail?.slotId || detail?._id,
    };
  }),
});

const getBookingServiceLabel = booking => {
  const names = getBookingServiceNames(booking);

  if (!names.length) {
    return 'Service not available';
  }

  if (names.length <= 2) {
    return names.join(', ');
  }

  return `${names[0]} + ${names.length - 1} more`;
};

const getBookingServiceNames = booking => {
  return getServiceDetails(booking)
    .map(service => service?.serviceName)
    .filter(Boolean);
};

const getBookingStartMoment = booking => {
  const scheduledMoments = getServiceDetails(booking)
    .map(service => {
      const scheduledAt =
        service?.scheduledAt ||
        service?.appointmentStartTime ||
        service?.startTime;
      const parsed = scheduledAt ? moment(scheduledAt) : null;
      return parsed?.isValid() ? parsed : null;
    })
    .filter(Boolean);

  if (scheduledMoments.length) {
    return scheduledMoments.sort((a, b) => a.valueOf() - b.valueOf())[0];
  }

  return parseBookingDateTime(booking?.date, booking?.time);
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

const getBookingEndMoment = booking => {
  const endMoments = getServiceDetails(booking)
    .map(service => {
      const scheduledAt =
        service?.scheduledAt ||
        service?.appointmentStartTime ||
        service?.startTime;
      const startMoment = scheduledAt ? moment(scheduledAt) : null;

      if (!startMoment?.isValid()) {
        return null;
      }

      return startMoment.clone().add(getServiceDurationMinutes(service), 'minutes');
    })
    .filter(Boolean);

  if (endMoments.length) {
    return endMoments.sort((a, b) => b.valueOf() - a.valueOf())[0];
  }

  const startMoment = getBookingStartMoment(booking);
  return startMoment?.isValid() ? startMoment.clone().add(30, 'minutes') : null;
};

const getBookingDateLabel = booking => {
  const startMoment = getBookingStartMoment(booking);
  return startMoment?.isValid()
    ? startMoment.format('ddd, MMM DD')
    : 'Date not available';
};

const isPendingPayment = booking => {
  return (
    booking?.status === APPOINTMENT_STATUS.PAYMENT_PENDING ||
    `${booking?.paymentStatus || ''}`.toLowerCase() === 'pending'
  );
};

const isExpiredBooking = booking => {
  return booking?.status === APPOINTMENT_STATUS.EXPIRED;
};

const isWalletPaymentMethod = booking => {
  return `${booking?.paymentMethod || ''}`.toLowerCase() === 'wallet';
};

const canPayForBooking = booking => {
  if (isExpiredBooking(booking)) {
    return false;
  }

  const startMoment = getBookingStartMoment(booking);
  return Boolean(startMoment?.isValid() && moment().isBefore(startMoment));
};

const getDisputeStatus = booking => {
  try {
    if (!booking?.dispute_expires_at) {
      return 'hidden';
    }

    const nowUtc = moment.utc();
    const appointmentEndUtc = getBookingEndMoment(booking)?.utc();
    const disputeExpiresAtUtc = moment.utc(booking.dispute_expires_at);
    const isAfterAppointmentEnd =
      appointmentEndUtc?.isValid() &&
      nowUtc.isSameOrAfter(appointmentEndUtc);
    const isBeforeDisputeExpiry =
      disputeExpiresAtUtc.isValid() &&
      nowUtc.isSameOrBefore(disputeExpiresAtUtc);

    console.log('Dispute visibility check:', {
      bookingId: booking?._id,
      nowUtc: nowUtc.format('YYYY-MM-DD HH:mm:ss [UTC]'),
      appointmentEndUtc: appointmentEndUtc?.isValid()
        ? appointmentEndUtc.format('YYYY-MM-DD HH:mm:ss [UTC]')
        : null,
      disputeExpiresAtUtc: disputeExpiresAtUtc.isValid()
        ? disputeExpiresAtUtc.format('YYYY-MM-DD HH:mm:ss [UTC]')
        : null,
      canShowDispute: isAfterAppointmentEnd && isBeforeDisputeExpiry,
    });

    return isAfterAppointmentEnd && isBeforeDisputeExpiry
      ? 'canDispute'
      : 'hidden';
  } catch (error) {
    console.log('Error calculating dispute status:', error);
    return 'hidden';
  }
};

const Booking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const focus = useIsFocused();
  //   useEffect(() => {
  //    getBookingsHandler();
  //  }, [focus]);
  const [selectedTab, setSelectedTab] = useState(
    normalizeBookingTab(route?.params?.initialTab),
  );
  const [upcomingData, setUpcomingData] = useState();
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {userData, token} = useSelector(state => state?.user);
  const {_id} = userData || {};
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [walletConfirmationBooking, setWalletConfirmationBooking] =
    useState(null);
  const [walletPaymentErrorModal, setWalletPaymentErrorModal] = useState({
    visible: false,
    message: '',
  });
  const [showSuccessCancelBookingModal, setShowSuccessCancelBookingModal] =
    useState(false);
  console.log('upcomingData', upcomingData);
  const selectedTabConfig =
    tabs.find(tab => tab.title === selectedTab) || tabs[0];
  const selectedStatus = selectedTabConfig.status;
  const isActionableStatusTab = [
    'up_coming',
    'payment_pending',
    'expired',
  ].includes(selectedTabConfig.bookingType);

  const getBookingsHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Bookings status request:', {
        selectedTab,
        status: selectedStatus,
      });
      const response = await getBookingsByIdAndStatus(_id, selectedStatus);
      console.log('response', response);
      if (selectedTab === 'Completed') {
        console.log(
          'Completed booking dispute expiry values',
          (response?.data || []).map((booking, index) => {
            const expiryMoment = booking?.dispute_expires_at
              ? moment(booking.dispute_expires_at)
              : null;
            const appointmentEndMoment = getBookingEndMoment(booking);
            const currentUtcReadable = moment
              .utc()
              .format('ddd, MMM DD YYYY hh:mm A [UTC]');

            return {
              index,
              bookingId: booking?._id,
              bookingDate: booking?.date,
              bookingTime: booking?.time,
              currentUtcReadable,
              dispute_expires_at: booking?.dispute_expires_at || null,
              readableLocal: expiryMoment
                ? expiryMoment.format('ddd, MMM DD YYYY hh:mm A')
                : null,
              readableUTC: booking?.dispute_expires_at
                ? moment
                    .utc(booking.dispute_expires_at)
                    .format('ddd, MMM DD YYYY hh:mm A [UTC]')
                : null,
              appointmentEndLocal: appointmentEndMoment?.isValid()
                ? appointmentEndMoment.format('ddd, MMM DD YYYY hh:mm A')
                : null,
              appointmentEndUTC: appointmentEndMoment?.isValid()
                ? appointmentEndMoment
                    .clone()
                    .utc()
                    .format('ddd, MMM DD YYYY hh:mm A [UTC]')
                : null,
              canShowDispute: getDisputeStatus(booking) === 'canDispute',
            };
          }),
        );
        console.log('Completed bookings response summary', {
          success: response?.success,
          count: response?.data?.length || 0,
          firstBooking: response?.data?.[0],
          firstBookingKeys:
            response?.data?.[0] && typeof response.data[0] === 'object'
              ? Object.keys(response.data[0])
              : [],
          firstServiceKeys:
            response?.data?.[0]?.serviceId &&
            typeof response.data[0].serviceId === 'object'
              ? Object.keys(response.data[0].serviceId)
              : typeof response?.data?.[0]?.serviceId,
          firstTechnicianKeys:
            response?.data?.[0]?.technicianId &&
            typeof response.data[0].technicianId === 'object'
              ? Object.keys(response.data[0].technicianId)
              : typeof response?.data?.[0]?.technicianId,
          firstSalonKeys:
            response?.data?.[0]?.salonId &&
            typeof response.data[0].salonId === 'object'
              ? Object.keys(response.data[0].salonId)
              : typeof response?.data?.[0]?.salonId,
        });
      }
      if (response?.success) {
        const sorted = [...(response?.data || [])].sort((a, b) => {
          const dateA = getBookingStartMoment(a)?.valueOf() || 0;
          const dateB = getBookingStartMoment(b)?.valueOf() || 0;
          return dateB - dateA;
        });
        setUpcomingData(sorted);
      } else {
        setUpcomingData('');
        // alert(response.message);
        // ShowToast('error', response.message);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      ShowToast('error', err?.response?.data?.message);
    }
  }, [_id, selectedStatus, selectedTab]);

  useEffect(() => {
    if (focus) {
      getBookingsHandler();
    }
  }, [focus, getBookingsHandler]);

  useEffect(() => {
    if (route?.params?.initialTab) {
      setSelectedTab(normalizeBookingTab(route.params.initialTab));
    }
  }, [route?.params?.initialTab]);

  const handleBookAgain = (booking, extra = {}) => {
    if (isAccountUnderReview(userData)) {
      Alert.alert('Account Under Review', getAccountReviewMessage(userData), [
        {text: 'OK'},
      ]);
      return;
    }

    const services = getServiceDetails(booking);
    const payload = buildBookingServiceSelectionPayload({
      salonId: booking?.salonId?._id || booking?.salonId,
      services,
      reschedule: false,
      myBookingId: null,
      extra: {
        source: 'bookAgain',
        ...extra,
      },
    });

    console.log('Book Again selection payload:', payload);

    if (!payload?.serviceId && !payload?.services?.length) {
      return ShowToast('error', 'Unable to prepare this booking again.');
    }

    navigation.navigate('StylistSelect', {
      data: payload,
    });
  };

  const handleExpiredRebook = booking => {
    if (isAccountUnderReview(userData)) {
      Alert.alert('Account Under Review', getAccountReviewMessage(userData), [
        {text: 'OK'},
      ]);
      return;
    }

    const services = getServiceDetails(booking);
    const salonId = booking?.salonId?._id || booking?.salonId;

    if (!salonId || !services.length) {
      return ShowToast('error', 'Unable to prepare this booking again.');
    }

    navigation.navigate('HomeDetails', {
      saloonId: salonId,
      preselectedServices: services,
      rebookMeta: {
        expiredBookingId: booking?._id,
        isExpiredRebook: true,
      },
    });
  };

  const navigateToCardPayment = booking => {
    navigation.navigate('SelectPaymentMethod', {
      bookingId: booking?._id,
      salonId: booking?.salonId?._id || booking?.salonId,
      price: booking?.totalAmount,
      pay: true,
      serviceDetail: booking?.servicesDetail,
    });
  };

  const handlePendingPayment = booking => {
    if (!isWalletPaymentMethod(booking)) {
      navigateToCardPayment(booking);
      return;
    }

    setWalletConfirmationBooking(booking);
  };

  const executeWalletPayment = async () => {
    const booking = walletConfirmationBooking;

    if (!booking || payingBookingId) {
      return;
    }

    setWalletConfirmationBooking(null);
    setPayingBookingId(booking?._id);
    try {
      console.log('payWithWallet pending booking request:', {
        bookingId: booking?._id,
        paymentMethod: booking?.paymentMethod,
      });
      const response = await payWithWallet(booking?._id, token);
      console.log('payWithWallet pending booking response:', response);

      if (response?.success) {
        ShowToast('success', response?.message || 'Payment successful');
        getBookingsHandler();
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
        'payWithWallet pending booking error:',
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
      setPayingBookingId(null);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: AppColors.WHITE,
        paddingBottom: responsiveHeight(10),
      }}>
      <AppHeader
        pTop={8.8}
        style={{paddingBottom: responsiveHeight(2)}}
        onPress={() => navigation.goBack()}
        title="Bookings"
      />
      <View
        style={{
          backgroundColor: '#B4B4B4',
          height: 0.5,
          elevation: 5,
          width: '100%',
          marginBottom: 10,
        }}
      />
      <CancelBookingModal
        visible={showCancelBookingModal}
        handleAppointmentButtonPress={() => {
          setShowCancelBookingModal(false);
          setShowSuccessCancelBookingModal(true);
        }}
        handleCancelButtonPress={() => {
          setShowCancelBookingModal(false);
          setShowSuccessCancelBookingModal(true);
        }}
      />

      <BookingCanceledModal
        visible={showSuccessCancelBookingModal}
        handlePress={() => {
          setShowSuccessCancelBookingModal(false);
          setShowSuccessCancelBookingModal(false);
        }}
      />

      <View
        style={{
          paddingHorizontal: responsiveWidth(5),
          paddingVertical: responsiveHeight(2),
        }}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 15}}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedTab(item.title)}>
                <AppText
                  title={item.title}
                  textSize={2.4}
                  textColor={
                    selectedTab === item.title
                      ? AppColors.BTNCOLOURS
                      : AppColors.DARKGRAY
                  }
                  borderBottomWidth={selectedTab === item.title ? 3 : 0}
                  borderBottomColor={
                    selectedTab === item.title ? AppColors.BTNCOLOURS : null
                  }
                  paddingBottom={responsiveHeight(0.5)}
                />
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={2} />
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors?.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {isActionableStatusTab &&
            (upcomingData?.length > 0 ? (
              <FlatList
                data={upcomingData}
                contentContainerStyle={{
                  flexGrow: 1,
                  gap: 10,
                  margin: 10,
                  marginTop: 0,
                  paddingBottom: responsiveHeight(2),
                }}
                renderItem={({item}) => {
                  const pendingPayment = isPendingPayment(item);
                  const expiredBooking = isExpiredBooking(item);
                  console.log('iterj', item);
                  return (
                    <BookingCard
                      onCardPress={() =>
                        navigation.navigate('BookingDetails', {
                          data: withServiceDetailSlotIds(item),
                        })
                      }
                      title={item?.salonId?.salonName}
                      img={item?.salonId?.image[0]}
                      location={item?.salonId?.location?.locationName}
                      date={getBookingDateLabel(item)}
                      saloonId={item?.salonId?._id}
                      service={getBookingServiceLabel(item)}
                      serviceItems={getBookingServiceNames(item)}
                      showServiceDetailsOnCard
                      bookingType={selectedTabConfig.bookingType}
                      bookingId={item?._id}
                      isPaymentPending={pendingPayment}
                      isExpired={expiredBooking}
                      canPayNow={pendingPayment && canPayForBooking(item)}
                      onBookAgainPress={() => handleExpiredRebook(item)}
                      payNowTitle={
                        isWalletPaymentMethod(item)
                          ? 'Pay With Wallet'
                          : 'Pay Now'
                      }
                      isPayNowLoading={payingBookingId === item?._id}
                      onPayNowPress={() => handlePendingPayment(item)}
                    />
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText
                  title="No Bookings Found"
                  textSize={3}
                  textColor={AppColors.BLACK}
                />
              </View>
            ))}

          {selectedTab === 'Completed' &&
            (upcomingData?.length > 0 ? (
              <FlatList
                data={upcomingData}
                contentContainerStyle={{
                  gap: 10,
                  marginTop: 0,
                  paddingHorizontal: responsiveWidth(5),
                  paddingBottom: responsiveHeight(2),
                }}
                renderItem={({item}) => {
                  const hasExistingDispute =
                    item?.dispute !== null && item?.dispute !== undefined;
                  // Create dispute is visible only during the backend 72-hour window.
                  const disputeStatus =
                    item?.dispute === null ? getDisputeStatus(item) : 'hidden';
                  return (
                    <BookingCard
                      onCardPress={() =>
                        navigation.navigate('HomeDetails', {
                          saloonId: item?.salonId?._id,
                        })
                      }
                      title={item?.salonId?.salonName}
                      img={item?.salonId?.image[0]}
                      location={item?.salonId?.location?.locationName}
                      date={getBookingDateLabel(item)}
                      bookingId={item?._id}
                      saloonId={item?.salonId?._id}
                      service={getBookingServiceLabel(item)}
                      serviceItems={getBookingServiceNames(item)}
                      showServiceDetailsOnCard
                      bookingType="completed"
                      hasDispute={hasExistingDispute}
                      dispute={item?.dispute}
                      disputeStatus={disputeStatus}
                      onBookAgainPress={() => handleBookAgain(item)}
                      onDisputePress={() => {
                        if (hasExistingDispute) {
                          // Always allow viewing existing disputes
                          navigation.navigate('ViewDispute', {
                            bookingData: item,
                            dispute: item?.dispute,
                          });
                        } else if (disputeStatus === 'canDispute') {
                          navigation.navigate('AddDispute', {
                            bookingData: item,
                          });
                        }
                      }}
                    />
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText
                  title="No Bookings Found"
                  textSize={3}
                  textColor={AppColors.BLACK}
                />
              </View>
            ))}

          {selectedTab === 'Canceled' &&
            (upcomingData?.length > 0 ? (
              <FlatList
                data={upcomingData}
                contentContainerStyle={{
                  gap: 10,
                  marginTop: 0,
                  paddingHorizontal: responsiveWidth(5),
                  paddingBottom: responsiveHeight(2),
                }}
                renderItem={({item}) => {
                  console.log('itemjhg', item);
                  return (
                    <BookingCard
                      disabled
                      title={item?.salonId?.salonName}
                      img={item?.salonId?.image[0]}
                      location={item?.salonId?.location?.locationName}
                      date={getBookingDateLabel(item)}
                      saloonId={item?.salonId?._id}
                      service={getBookingServiceLabel(item)}
                      serviceItems={getBookingServiceNames(item)}
                      showServiceDetailsOnCard
                      bookingType="canceled"
                    />
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 0.8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText
                  title="No Bookings Found"
                  textSize={3}
                  textColor={AppColors.BLACK}
                />
              </View>
            ))}
          <ConfirmationModal
            iconName="questioncircle"
            title="Pay With Wallet?"
            subTitle="Are you sure you want to complete this payment using your Nail Warz wallet?"
            buttonOneTitle="Pay With Wallet"
            buttonTwoTitle="Cancel"
            isChangeColor
            visible={Boolean(walletConfirmationBooking)}
            setVisible={executeWalletPayment}
            handleBackPress={() => setWalletConfirmationBooking(null)}
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
        </View>
      )}
    </ScrollView>
  );
};

export default Booking;
