/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation, CommonActions} from '@react-navigation/native';
import SaloonsCard from '../../components/SaloonsCard';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppButton from '../../components/AppButton';
import {
  createBooking,
  getSaloonById,
  getWalletByUserId,
  payWithWallet,
  rescheduleEntireBooking as rescheduleEntireBookingApi,
  updateBookingStatusByUser,
  updateBooking,
  validateBookingDiscount,
} from '../../GlobalFunctions';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';
import ConfirmationModal from '../../components/ConfirmationModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import {
  formatBookingCurrency,
  getDiscountDescriptor,
} from '../../utils/bookingPricing';
import {formatPaymentMessageDateTimes} from '../../utils/paymentMessages';

// const pricingDetails = [
//   {id: 1, title: 'Dip Powder Nails', amount: '$10.00'},
//   {id: 2, title: 'Dip Powder Nails', amount: '$5.00'},
//   {id: 3, title: 'Discount', amount: '$3.00'},
//   {id: 4, title: 'Total', amount: '$12.00'},
// ];

function calculatePlatformFee(subtotal) {
  const amount = Number(subtotal) || 0;
  if (amount <= 0) return 0;
  if (amount < 40) return 2.99; // Under $40: $2.99
  if (amount <= 75) return 3.99; // $40 – $75: $3.99
  if (amount <= 150) return 4.99; // $75 – $150: $4.99

  return 5.99; // $150+: $5.99
}

const BookingSummary = ({route}) => {
  const navigation = useNavigation();
  const [saloonData, setSaloonData] = useState();
  const routeData = route?.params?.data;
  const bookingRouteData = useMemo(() => routeData || {}, [routeData]);

  const [isLoading, setIsLoading] = useState(false);
  const [saloonLoading, setSaloonLoading] = useState(false);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({
    id: 0,
  });
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [paymentErrorModal, setPaymentErrorModal] = useState({
    visible: false,
    message: '',
  });
  const [discountMessageModal, setDiscountMessageModal] = useState({
    visible: false,
    message: '',
  });
  const [slotConflictModal, setSlotConflictModal] = useState({
    visible: false,
    message: '',
    routePayload: null,
  });
  const {
    selectedBookingDate,
    technicianName,
    serviceName,
    price,
    selectedTime,
    selectedDate,
    selectedDay,
    reschedule,
    rescheduleEntireBooking = false,
    myBookingId,
    originalDate,
    serviceSchedules = [],
    updatePendingBooking = false,
    updateBookingId,
    existingServiceDetail = [],
  } = bookingRouteData;
  const saloonId = bookingRouteData?.saloonId || bookingRouteData?.salonId;
  const [activePaymentMethod, setActivePaymentMethod] = useState(1);
  const [bookingId, setBookingId] = useState();
  const [receiptBooking, setReceiptBooking] = useState();
  const [walletDetails, setWalletDetails] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPayWithWallet, setIsPayWithWallet] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const {token} = useSelector(state => state.user);
  const momentDay = moment().day();
  const index = momentDay === 0 ? 6 : momentDay - 1;
  // selectedTime: isSelectedTime,
  //               selectedDate: isSelectedDate?.date,
  //               selectedDay: isSelectedDate?.day,
  //               selectedBookingDate: isSelectedDate?.formattedDate,
  const hasServiceSchedule = serviceSchedules.length > 0;
  const hasMultipleServiceSchedules = serviceSchedules.length > 1;
  const payableAmount = Number(price) || 0;
  const formatCurrency = formatBookingCurrency;
  const displayTechnicianName = technicianName || 'Nail Technician';
  const priceRows = hasServiceSchedule
    ? serviceSchedules.map((schedule, scheduleIndex) => ({
        id: `price-${schedule?.serviceId || scheduleIndex}`,
        title: schedule?.serviceName || `Service ${scheduleIndex + 1}`,
        amount: Number(schedule?.price) || 0,
      }))
    : [
        {
          id: 'price-service',
          title: serviceName || 'Service',
          amount: payableAmount,
        },
      ];
  const serviceSubtotal = priceRows.reduce(
    (total, item) => total + (Number(item?.amount) || 0),
    0,
  );
  const discountValidationSubtotal = serviceSubtotal;
  const pricingSummary = appliedDiscount?.pricingSummary;
  const discountDetails = appliedDiscount?.discountDetails;
  const discountDescriptor = getDiscountDescriptor(discountDetails);
  const discountMetaText = discountDescriptor;
  const originalSubtotal = Number(
    pricingSummary?.originalSubtotal ?? serviceSubtotal,
  );
  const discountAmount = Number(pricingSummary?.discountAmount ?? 0);
  const discountedSubtotal = Number(
    pricingSummary?.discountedSubtotal ??
      Math.max(originalSubtotal - discountAmount, 0),
  );
  const displayPlatformCharge = Number(
    pricingSummary?.appCharges ?? calculatePlatformFee(serviceSubtotal),
  );
  const displayTotalAmount = Number(
    pricingSummary?.totalAmount ??
      parseFloat((discountedSubtotal + displayPlatformCharge).toFixed(2)),
  );
  console.log('displayTotalAmount', displayTotalAmount);
  const bookingDetails = [
    {
      id: 'date',
      title: 'Date',
      date: `${selectedDay} ${selectedDate}`,
    },
    ...(hasMultipleServiceSchedules
      ? serviceSchedules.map((schedule, scheduleIndex) => ({
          id: `service-${schedule?.serviceId}-${scheduleIndex}`,
          title: schedule?.serviceName || `Service ${scheduleIndex + 1}`,
          date: `${schedule?.technicianName || displayTechnicianName} • ${
            schedule?.time
          } - ${schedule?.endTime}`,
        }))
      : [
          {
            id: 'technician',
            title: 'Nail Technician',
            date: `${
              serviceSchedules?.[0]?.technicianName || displayTechnicianName
            } • ${serviceSchedules?.[0]?.time || selectedTime?.value} - ${
              serviceSchedules?.[0]?.endTime ||
              `${serviceSchedules?.[0]?.durationMinutes || 30} Mins`
            }`,
          },
        ]),
  ];
  const paymentDetails = [
    {id: 1, title: 'Pay Online Now', subTitle: 'Secure your booking instantly'},
    {
      id: 2,
      title: 'Pay With Wallet',
      subTitle: 'Pay conveniently using your wallet balance',
    },
  ];
  const getScheduledAt = useCallback(
    schedule => {
      if (schedule?.scheduledAt && moment(schedule.scheduledAt).isValid()) {
        return moment(schedule.scheduledAt).toISOString();
      }

      const parsedDateTime = moment(
        `${selectedBookingDate} ${schedule?.time}`,
        ['DD-MM-YYYY hh:mm A', 'DD-MM-YYYY h:mm A'],
        true,
      );

      return parsedDateTime.isValid() ? parsedDateTime.toISOString() : null;
    },
    [selectedBookingDate],
  );
  const getServicesDetail = useCallback(
    () =>
      serviceSchedules
        .map(schedule => ({
          service: schedule?.serviceId,
          slotId: schedule?.slotId,
          technician: schedule?.technicianId,
          selectedTechnician: schedule?.selectedTechnician,
          scheduledAt: getScheduledAt(schedule),
        }))
        .filter(
          item => item.service && item.technician && Boolean(item.scheduledAt),
        ),
    [getScheduledAt, serviceSchedules],
  );
  const getServiceDetailId = service => {
    return service?._id || service?.slotId || service?.serviceDetailId;
  };
  const getUpdatedExistingServiceDetail = useCallback(() => {
    const nextServiceDetail = getServicesDetail();
    const stripInternalFields = serviceDetail =>
      serviceDetail.map(
        ({
          slotId: _slotId,
          selectedTechnician: _selectedTechnician,
          ...service
        }) => service,
      );

    if (!updatePendingBooking) {
      return stripInternalFields(nextServiceDetail);
    }

    if (
      !Array.isArray(existingServiceDetail) ||
      !existingServiceDetail.length
    ) {
      return stripInternalFields(nextServiceDetail);
    }

    return existingServiceDetail.map(existingService => {
      const existingSlotId = getServiceDetailId(existingService);
      const updatedService = nextServiceDetail.find(service => {
        return (
          existingSlotId && service?.slotId && existingSlotId === service.slotId
        );
      });

      if (!updatedService) {
        return existingService;
      }

      const selectedTechnician =
        updatedService?.selectedTechnician &&
        typeof updatedService.selectedTechnician === 'object'
          ? updatedService.selectedTechnician
          : null;

      return {
        ...existingService,
        technician: selectedTechnician || updatedService.technician,
        scheduledAt: updatedService.scheduledAt,
      };
    });
  }, [existingServiceDetail, getServicesDetail, updatePendingBooking]);
  const getUpdateScheduleDebugRows = useCallback(
    finalServiceDetail => {
      const selectedServiceDetail = getServicesDetail();
      const findBySlotId = (collection, slotId) =>
        Array.isArray(collection)
          ? collection.find(item => getServiceDetailId(item) === slotId)
          : null;

      return (finalServiceDetail || []).map(finalService => {
        const slotId = getServiceDetailId(finalService);
        const originalService = findBySlotId(existingServiceDetail, slotId);
        const selectedService = selectedServiceDetail.find(
          item => item?.slotId === slotId,
        );
        const selectedSchedule = serviceSchedules.find(
          schedule => schedule?.slotId === slotId,
        );
        const originalScheduledAt = originalService?.scheduledAt;
        const payloadScheduledAt = finalService?.scheduledAt;

        return {
          slotId,
          serviceName:
            finalService?.serviceName ||
            finalService?.service?.serviceName ||
            selectedSchedule?.serviceName,
          selectedDate: selectedBookingDate,
          selectedTime: selectedSchedule?.time,
          originalScheduledAt,
          selectedScheduledAt: selectedService?.scheduledAt,
          payloadScheduledAt,
          changedInPayload:
            Boolean(originalScheduledAt) &&
            Boolean(payloadScheduledAt) &&
            originalScheduledAt !== payloadScheduledAt,
        };
      });
    },
    [
      existingServiceDetail,
      getServicesDetail,
      selectedBookingDate,
      serviceSchedules,
    ],
  );
  const getResponseScheduleDebugRows = useCallback(response => {
    const responseBooking = response?.data || response?.booking || response;
    const responseServices = Array.isArray(responseBooking?.servicesDetail)
      ? responseBooking.servicesDetail
      : Array.isArray(responseBooking?.serviceDetail)
      ? responseBooking.serviceDetail
      : [];

    return responseServices.map(service => ({
      slotId: getServiceDetailId(service),
      serviceName: service?.serviceName || service?.service?.serviceName,
      scheduledAt: service?.scheduledAt,
    }));
  }, []);
  const getCreateBookingPayload = useCallback(() => {
    const payload = {
      salonId: saloonId,
      paymentMethod: activePaymentMethod === 1 ? 'Card' : 'Wallet',
      servicesDetail: getUpdatedExistingServiceDetail(),
    };

    if (discountDetails?.codeId) {
      payload.discountCodeId = discountDetails.codeId;
    }

    return payload;
  }, [
    activePaymentMethod,
    discountDetails?.codeId,
    getUpdatedExistingServiceDetail,
    saloonId,
  ]);

  const getServiceIdFromDetail = detail => {
    return detail?.service?._id || detail?.service || detail?.serviceId;
  };
  const getServiceNameFromDetail = detail => {
    return detail?.serviceName || detail?.service?.serviceName;
  };
  const getServiceDetailIdFromDetail = detail => {
    return detail?._id || detail?.slotId || detail?.serviceDetailId;
  };
  const getScheduledAtFromDetail = detail => {
    return detail?.scheduledAt || detail?.formattedTime;
  };
  const getTechnicianFromDetail = detail => {
    return detail?.technician && typeof detail.technician === 'object'
      ? detail.technician
      : null;
  };
  const isSameConflictServiceDetail = (bookingService, conflictService) => {
    const bookingSlotId = getServiceDetailIdFromDetail(bookingService);
    const conflictSlotId = getServiceDetailIdFromDetail(conflictService);

    if (bookingSlotId && conflictSlotId) {
      return bookingSlotId === conflictSlotId;
    }

    const bookingName = `${getServiceNameFromDetail(bookingService) || ''}`
      .trim()
      .toLowerCase();
    const conflictName = `${getServiceNameFromDetail(conflictService) || ''}`
      .trim()
      .toLowerCase();
    const bookingScheduledAt = getScheduledAtFromDetail(bookingService);
    const conflictScheduledAt = getScheduledAtFromDetail(conflictService);

    return (
      Boolean(bookingName) &&
      bookingName === conflictName &&
      Boolean(bookingScheduledAt) &&
      bookingScheduledAt === conflictScheduledAt
    );
  };
  const buildSlotConflictRouteDataFromBooking = (
    bookingData,
    conflictedServiceDetail = [],
  ) => {
    const bookingServices = Array.isArray(bookingData?.servicesDetail)
      ? bookingData.servicesDetail
      : [];
    const serviceTechnicianSelections = bookingServices
      .map((detail, detailIndex) => {
        const technician = getTechnicianFromDetail(detail);
        const technicianId = technician?._id || detail?.technician;
        const serviceId = getServiceIdFromDetail(detail);

        if (!serviceId || !technicianId) {
          return null;
        }

        return {
          scheduleKey: `${serviceId}-${
            getServiceDetailIdFromDetail(detail) || detailIndex
          }`,
          serviceId,
          slotId: getServiceDetailIdFromDetail(detail),
          serviceName: getServiceNameFromDetail(detail),
          salonId: saloonId,
          price: detail?.price ?? detail?.service?.price,
          scheduledAt: detail?.scheduledAt,
          selectedTechnicianId: technicianId,
          selectedTechnicianName:
            technician?.fullName || detail?.technicianName,
          selectedTechnician: technician || {_id: technicianId},
          durationMinutes:
            detail?.durationMinutes ||
            detail?.duration ||
            detail?.service?.durationMinutes ||
            detail?.service?.duration ||
            30,
          isConflicted: conflictedServiceDetail.some(conflictDetail =>
            isSameConflictServiceDetail(detail, conflictDetail),
          ),
        };
      })
      .filter(Boolean);

    return {
      salonId: saloonId,
      saloonId,
      isMultiService: true,
      source: 'paymentSlotConflict',
      updatePendingBooking: true,
      updateBookingId: bookingData?._id || bookingId,
      existingServiceDetail: bookingServices,
      conflictedServiceDetail,
      serviceTechnicianSelections,
      totalPrice: serviceTechnicianSelections.reduce(
        (total, service) => total + (Number(service?.price) || 0),
        0,
      ),
    };
  };

  useEffect(() => {
    console.log('BookingSummary route data:', bookingRouteData);
    console.log('BookingSummary resolved values:', {
      saloonId,
      selectedBookingDate,
      selectedDate,
      selectedDay,
      selectedTime,
      price,
      payableAmount,
      activePaymentMethod,
      serviceSchedules,
      servicesDetailPreview: getServicesDetail(),
    });
    console.log(
      'BookingSummary createBooking payload preview:',
      getCreateBookingPayload(),
    );
  }, [
    activePaymentMethod,
    payableAmount,
    price,
    bookingRouteData,
    getCreateBookingPayload,
    getServicesDetail,
    saloonId,
    selectedBookingDate,
    selectedDate,
    selectedDay,
    selectedTime,
    serviceSchedules,
  ]);
  const getSaloonByIdHandler = async () => {
    if (!saloonId) {
      setSaloonLoading(false);
      return;
    }

    setSaloonLoading(true);
    try {
      const response = await getSaloonById(saloonId);
      setSaloonData(response?.data);
    } catch (error) {
      console.log(
        'getSaloonById error in BookingSummary:',
        error?.response?.data || error?.message || error,
      );
    } finally {
      setSaloonLoading(false);
    }
  };
  const navigateToHomeAndResetStack = () => {
    const rootRoute = navigation.getState()?.routeNames?.[0] || 'Booking';
    try {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: rootRoute}],
        }),
      );
    } catch (e) {
      console.log('Navigation reset error:', e);
    }
    navigation.navigate('Home');
  };

  const updateBookingHandler = async () => {
    if (isLoading) {
      return;
    }

    const rescheduleSchedule = serviceSchedules[0];
    const scheduledAt = getScheduledAt(rescheduleSchedule);
    const slotId =
      rescheduleSchedule?.slotId ||
      bookingRouteData?.slotId ||
      bookingRouteData?.serviceDetailId ||
      bookingRouteData?.appointmentServiceId;
    const reschedulePayload = {
      bookingId: myBookingId,
      slotId,
      scheduledAt,
      ...(rescheduleSchedule?.technicianId
        ? {technician: rescheduleSchedule.technicianId}
        : {}),
    };

    if (!myBookingId || !slotId || !scheduledAt) {
      return ShowToast(
        'error',
        'Unable to reschedule this service. Please try again.',
      );
    }

    setIsLoading(true);
    try {
      const response = await updateBooking(reschedulePayload, token);
      setIsLoading(false);
      if (response.success) {
        ShowToast('success', 'Appointment Rescheduled Successfully');
        navigateToHomeAndResetStack();
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      setIsLoading(false);
      return ShowToast('error', error?.response?.data?.message);
    }
  };
  const rescheduleEntireBookingHandler = async () => {
    if (isLoading) {
      return;
    }

    const servicesDetail = serviceSchedules.map((schedule, scheduleIndex) => {
      const matchingSelection =
        bookingRouteData?.serviceTechnicianSelections?.[scheduleIndex] ||
        bookingRouteData?.services?.[scheduleIndex];
      const slotId =
        schedule?.slotId ||
        schedule?.serviceDetailId ||
        schedule?.appointmentServiceId ||
        matchingSelection?.slotId ||
        matchingSelection?.serviceDetailId ||
        matchingSelection?.appointmentServiceId;
      const scheduledAt = getScheduledAt(schedule);
      const technician = schedule?.technicianId;

      return {
        slotId,
        scheduledAt,
        ...(technician ? {technician} : {}),
      };
    });

    const invalidSchedule = servicesDetail.find(
      s => !s.slotId || !s.scheduledAt,
    );

    console.log('RESCHEDULE_ENTIRE_BOOKING_PRE_CHECK:', {
      myBookingId,
      servicesDetail,
      invalidSchedule,
      serviceSchedulesCount: serviceSchedules.length,
      bookingRouteDataSummary: {
        myBookingId,
        hasServiceTechnicianSelections: Boolean(
          bookingRouteData?.serviceTechnicianSelections?.length,
        ),
        hasServices: Boolean(bookingRouteData?.services?.length),
      },
    });

    if (!myBookingId || invalidSchedule || servicesDetail.length === 0) {
      return ShowToast(
        'error',
        'Unable to reschedule services. Please verify your selected times.',
      );
    }

    const reschedulePayload = {
      bookingId: myBookingId,
      servicesDetail,
    };

    console.log(
      'RESCHEDULE_ENTIRE_BOOKING_HANDLER_PAYLOAD:',
      reschedulePayload,
    );

    setIsLoading(true);
    try {
      const response = await rescheduleEntireBookingApi(
        reschedulePayload,
        token,
      );
      console.log('RESCHEDULE_ENTIRE_BOOKING_HANDLER_RESPONSE:', response);
      setIsLoading(false);
      if (response.success) {
        ShowToast('success', 'Appointment Rescheduled Successfully');
        navigateToHomeAndResetStack();
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      console.log('RESCHEDULE_ENTIRE_BOOKING_HANDLER_ERROR:', {
        error,
        response: error?.response,
        responseData: error?.response?.data,
        message: error?.response?.data?.message || error?.message,
      });
      setIsLoading(false);
      return ShowToast(
        'error',
        error?.response?.data?.message || 'Unable to reschedule booking',
      );
    }
  };
  const getWalletHandler = async () => {
    try {
      const response = await getWalletByUserId(token);
      setWalletDetails(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleDiscountCodeChange = value => {
    setDiscountCode(value);
    if (
      appliedDiscount?.discountDetails?.code &&
      value.trim().toUpperCase() !==
        appliedDiscount.discountDetails.code.trim().toUpperCase()
    ) {
      setAppliedDiscount(null);
    }
  };
  const validateDiscountHandler = async () => {
    const code = discountCode.trim();

    if (!code) {
      return ShowToast('error', 'Please enter a discount code');
    }

    if (!saloonId) {
      return ShowToast('error', 'Salon details are missing');
    }

    if (discountLoading) {
      return;
    }

    const discountPayload = {
      code,
      salonId: saloonId,
      subtotal: discountValidationSubtotal,
    };

    setDiscountLoading(true);
    try {
      console.log('validateBookingDiscount request payload:', discountPayload);
      const response = await validateBookingDiscount(discountPayload, token);
      console.log('validateBookingDiscount API response:', response);
      setDiscountLoading(false);

      if (response?.success) {
        setAppliedDiscount({
          discountDetails: response?.discountDetails,
          pricingSummary: response?.pricingSummary,
        });
        setDiscountCode(response?.discountDetails?.code || code);
        ShowToast('success', response?.message || 'Discount code applied');
      } else {
        setAppliedDiscount(null);
        setDiscountMessageModal({
          visible: true,
          message: response?.message || 'Invalid discount code',
        });
      }
    } catch (error) {
      setDiscountLoading(false);
      setAppliedDiscount(null);
      console.log(
        'validateBookingDiscount API error:',
        error?.response?.data || error?.message || error,
      );
      setDiscountMessageModal({
        visible: true,
        message:
          error?.response?.data?.message || 'Unable to apply discount code',
      });
    }
  };
  const payWithWalletHandler = async () => {
    if (paymentLoading) {
      return;
    }

    setPaymentLoading(true);
    try {
      console.log('paymentWithWallet request payload:', {
        bookingId,
      });
      const response = await payWithWallet(bookingId, token);
      setPaymentLoading(false);
      console.log('paymentWithWallet API response:', response);
      if (response.success) {
        // ShowToast('success', response.message);
        setIsPayWithWallet(false);
        setReceiptBooking(response?.booking);
        setVisibleConfirmationModal(true);
        getWalletHandler();
      } else {
        setIsPayWithWallet(false);
        setPaymentErrorModal({
          visible: true,
          message:
            formatPaymentMessageDateTimes(response?.message) ||
            'We could not process your wallet payment. Please try again.',
        });
      }
    } catch (error) {
      console.log(
        'paymentWithWallet API error:',
        error?.response?.data || error?.message || error,
      );
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        '';
      const conflictedServiceDetail = Array.isArray(
        error?.response?.data?.conflictingSlots,
      )
        ? error.response.data.conflictingSlots
        : Array.isArray(error?.response?.data?.existingServiceDetail)
        ? error.response.data.existingServiceDetail
        : [];
      const isSlotConflict =
        errorMessage.toLowerCase().includes('already been booked') ||
        (errorMessage.toLowerCase().includes('time slot') &&
          errorMessage.toLowerCase().includes('booked'));

      if (isSlotConflict && bookingId && receiptBooking?.servicesDetail) {
        const routePayload = buildSlotConflictRouteDataFromBooking(
          {
            ...receiptBooking,
            _id: receiptBooking?._id || bookingId,
          },
          conflictedServiceDetail,
        );

        console.log(
          'paymentWithWallet slot conflict route payload:',
          routePayload,
        );

        if (routePayload.serviceTechnicianSelections.length) {
          setPaymentLoading(false);
          setIsPayWithWallet(false);
          setSlotConflictModal({
            visible: true,
            message:
              formatPaymentMessageDateTimes(errorMessage) ||
              'This appointment time is no longer available. Please choose another available time.',
            routePayload,
          });
          return;
        }
      }

      setPaymentLoading(false);
      setIsPayWithWallet(false);
      setPaymentErrorModal({
        visible: true,
        message:
          formatPaymentMessageDateTimes(errorMessage) ||
          'We could not process your wallet payment. Please try again.',
      });
    }
  };
  const createBookingHandler = async () => {
    if (isLoading) {
      return;
    }

    const servicesDetail = getServicesDetail();

    if (!servicesDetail.length) {
      return ShowToast('error', 'Please select a service to continue');
    }

    if (servicesDetail.length !== serviceSchedules.length) {
      return ShowToast(
        'error',
        'Please select date and time for every service',
      );
    }

    if (activePaymentMethod === 2) {
      if (displayTotalAmount > walletDetails?.balance) {
        return ShowToast('error', 'Insufficient Wallet Balance');
      }
    }
    setIsLoading(true);
    try {
      const bookingPayload = getCreateBookingPayload();
      if (updatePendingBooking) {
        const pendingBookingId = updateBookingId || myBookingId;
        const updatePayload = {
          bookingId: pendingBookingId,
          servicesDetail: bookingPayload.servicesDetail,
        };
        const requestScheduleDebugRows = getUpdateScheduleDebugRows(
          updatePayload.servicesDetail,
        );

        if (!pendingBookingId) {
          setIsLoading(false);
          return ShowToast('error', 'Booking details are missing.');
        }

        console.log(
          'UPDATE_BOOKING_STATUS_BY_USER_SCHEDULE_COMPARE_REQUEST:',
          requestScheduleDebugRows,
        );
        console.log('UPDATE_BOOKING_STATUS_BY_USER_REQUEST_PAYLOAD:', {
          ...updatePayload,
          servicesDetailCount: updatePayload.servicesDetail?.length || 0,
        });
        console.log(
          'UPDATE_BOOKING_STATUS_BY_USER_SERVICE_DETAIL_JSON_FOR_POSTMAN:',
          JSON.stringify(updatePayload.servicesDetail, null, 2),
        );
        const updateResponse = await updateBookingStatusByUser(updatePayload);
        setIsLoading(false);
        const responseScheduleDebugRows =
          getResponseScheduleDebugRows(updateResponse);
        console.log('UPDATE_BOOKING_STATUS_BY_USER_API_RESPONSE:', {
          success: updateResponse?.success,
          message: updateResponse?.message,
          data: updateResponse?.data,
          booking: updateResponse?.booking,
          servicesDetailCount:
            updateResponse?.data?.servicesDetail?.length ||
            updateResponse?.booking?.servicesDetail?.length ||
            0,
          raw: updateResponse,
        });
        console.log(
          'UPDATE_BOOKING_STATUS_BY_USER_SCHEDULE_COMPARE_RESPONSE:',
          responseScheduleDebugRows,
        );
        console.log(
          'UPDATE_BOOKING_STATUS_BY_USER_SCHEDULE_MISMATCH_CHECK:',
          requestScheduleDebugRows.map(requestRow => {
            const responseRow = responseScheduleDebugRows.find(
              row => row?.slotId === requestRow?.slotId,
            );

            return {
              slotId: requestRow?.slotId,
              serviceName: requestRow?.serviceName,
              frontendSentScheduledAt: requestRow?.payloadScheduledAt,
              backendReturnedScheduledAt: responseRow?.scheduledAt,
              backendMatchesFrontend:
                responseRow?.scheduledAt === requestRow?.payloadScheduledAt,
            };
          }),
        );

        if (updateResponse?.success) {
          const updatedBooking = updateResponse?.data ||
            updateResponse?.booking || {
              _id: pendingBookingId,
              servicesDetail: bookingPayload.servicesDetail,
            };
          setReceiptBooking(updatedBooking);

          if (activePaymentMethod === 1) {
            navigation.navigate('SelectPaymentMethod', {
              bookingId: pendingBookingId,
              salonId: saloonId,
              pay: true,
              serviceDetail:
                updatedBooking?.servicesDetail || bookingPayload.servicesDetail,
            });
          } else {
            setBookingId(pendingBookingId);
            setIsPayWithWallet(true);
          }
          return;
        }

        return ShowToast('error', updateResponse?.message);
      }

      console.log('createBooking request payload:', bookingPayload);
      const response = await createBooking(bookingPayload, token);
      setIsLoading(false);
      console.log('createBooking API response:', response);

      if (response?.success) {
        setReceiptBooking(response?.data);
        if (!reschedule) {
          if (activePaymentMethod === 1) {
            navigation.navigate('SelectPaymentMethod', {
              bookingId: response?.data?._id,
              salonId: saloonId,
              pay: true,
              serviceDetail: response?.data?.servicesDetail,
            });
          } else {
            // navigation.navigate('Wallet', {
            //   bookingId: response?.data?._id,
            //   price: price,
            //   userId: _id,
            // });
            setBookingId(response?.data?._id);
            setIsPayWithWallet(true);
          }
        } else {
          setBookingId(response?.data?._id);
          setVisibleConfirmationModal(true);
        }
        // return ShowToast('success', response.message);
      } else {
        return ShowToast('error', response.message);
      }
    } catch (err) {
      console.log(
        'createBooking API error:',
        err?.response?.data || err?.message || err,
      );
      ShowToast('error', err?.response?.data?.message);
      setIsLoading(false);
      throw err;
    }
  };
  useEffect(() => {
    getSaloonByIdHandler();
    // Existing screen-level fetch intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getWalletHandler();
    // Existing screen-level fetch intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(10),
          backgroundColor: AppColors.WHITE,
        }}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title="Booking Summary"
        />
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 0.5,
            elevation: 5,
            width: '100%',
          }}
        />
        <LineBreak space={1.5} />
        {saloonLoading ? (
          <View
            style={{height: responsiveHeight(10), justifyContent: 'center'}}>
            <ActivityIndicator size={40} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <FlatList
            data={[
              {
                id: 1,
                img: saloonData?.image[0],
                title: saloonData?.salonName,
                location: saloonData?.bussinessAddress,
                KM: 2,
                Rating: saloonData?.avgRating,
                TotalNoOfRating: saloonData?.totalReviews,
                workingDays: saloonData?.workingDays[index],
              },
            ]}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => {
              return (
                <SaloonsCard
                  showDeleteCard={false}
                  disabled={true}
                  title={item.title}
                  KM={item.KM}
                  textWidth={48}
                  saloonId={saloonId}
                  Rating={item.Rating}
                  TotalNoOfRating={item?.TotalNoOfRating}
                  workingDays={item?.workingDays}
                  // workingDays={item?.workingDays[index]}
                  img={item.img}
                  location={item.location}
                />
              );
            }}
          />
        )}

        <LineBreak space={2} />

        <View
          style={{
            backgroundColor: AppColors.WHITE,
            paddingHorizontal: responsiveWidth(4),
          }}>
          <LineBreak space={2} />

          <AppText
            title="Booking Details"
            textSize={2.2}
            textColor={AppColors.BLACK}
            textFontWeight
          />

          <LineBreak space={1.5} />

          <FlatList
            data={bookingDetails}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => {
              return (
                <View>
                  <AppText
                    title={item.title}
                    textSize={2}
                    textColor={AppColors.BLACK}
                  />
                  {reschedule && item.id === 'date' ? (
                    <View style={{gap: 8, marginTop: 6}}>
                      <View
                        style={{
                          backgroundColor: '#FFF4F4',
                          borderRadius: 8,
                          padding: responsiveHeight(1.2),
                          borderLeftWidth: 3,
                          borderLeftColor: '#AAAAAA',
                        }}>
                        <AppText
                          title="Original"
                          textSize={1.5}
                          textColor={'#AAAAAA'}
                          textFontWeight
                        />
                        <AppText
                          title={
                            rescheduleEntireBooking &&
                            typeof originalDate === 'string'
                              ? originalDate.replace(/ at /i, ' from ')
                              : originalDate
                          }
                          textSize={1.8}
                          textColor={'#AAAAAA'}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: '#FFF4F4',
                          borderRadius: 8,
                          padding: responsiveHeight(1.2),
                          borderLeftWidth: 3,
                          borderLeftColor: AppColors.BTNCOLOURS,
                          marginBottom: responsiveHeight(1.5),
                        }}>
                        <AppText
                          title="New Appointment"
                          textSize={1.5}
                          textColor={AppColors.BTNCOLOURS}
                          textFontWeight
                        />
                        <AppText
                          title={item.date}
                          textSize={1.8}
                          textColor={AppColors.BLACK}
                        />
                      </View>
                    </View>
                  ) : (
                    <AppText
                      title={item.date}
                      textSize={1.7}
                      textColor={AppColors.DARKGRAY}
                    />
                  )}
                </View>
              );
            }}
          />

          {reschedule ? null : (
            <View>
              <LineBreak space={4} />
              <AppText
                title="Payment"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
              />

              <LineBreak space={1.5} />
              <FlatList
                data={paymentDetails}
                contentContainerStyle={{gap: 10}}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => {
                        setActivePaymentMethod(item.id);
                      }}>
                      <View>
                        <AppText
                          title={item.title}
                          textSize={1.9}
                          textColor={AppColors.BLACK}
                        />
                        <AppText
                          title={item.subTitle}
                          textSize={1.7}
                          textColor={AppColors.DARKGRAY}
                        />
                      </View>
                      <Fontisto
                        name={
                          item.id === activePaymentMethod
                            ? 'radio-btn-active'
                            : 'radio-btn-passive'
                        }
                        size={responsiveFontSize(2.5)}
                        color={AppColors.BLUE}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
          {activePaymentMethod === 2 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: responsiveHeight(1.5),
              }}>
              <AppText
                textSize={2}
                textColor={AppColors.BLACK}
                title="Current Balance"
              />
              <AppText
                title={formatCurrency(walletDetails?.balance)}
                textSize={1.7}
                textColor={AppColors.DARKGRAY}
              />
            </View>
          ) : null}
          <LineBreak space={4} />

          {reschedule ? null : (
            <View>
              <AppText
                title="Discount Code"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <LineBreak space={1.2} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: appliedDiscount ? '#B7E2C5' : '#E4E4E4',
                  borderRadius: 10,
                  backgroundColor: appliedDiscount ? '#F5FFF8' : '#FAFAFA',
                  paddingLeft: responsiveWidth(3),
                  minHeight: responsiveHeight(5.8),
                }}>
                <TextInput
                  autoCapitalize="characters"
                  editable={!discountLoading}
                  onChangeText={handleDiscountCodeChange}
                  placeholder="Enter discount code"
                  placeholderTextColor={AppColors.DARKGRAY}
                  style={{
                    flex: 1,
                    color: AppColors.BLACK,
                    fontSize: responsiveFontSize(1.75),
                    paddingVertical: 0,
                    paddingRight: responsiveWidth(2),
                  }}
                  value={discountCode}
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={discountLoading || !discountCode.trim()}
                  onPress={validateDiscountHandler}
                  style={{
                    alignSelf: 'stretch',
                    minWidth: responsiveWidth(22),
                    paddingHorizontal: responsiveWidth(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: discountCode.trim()
                      ? AppColors.BTNCOLOURS
                      : '#CCCCCC',
                    opacity: discountLoading ? 0.8 : 1,
                  }}>
                  {discountLoading ? (
                    <ActivityIndicator size="small" color={AppColors.WHITE} />
                  ) : (
                    <AppText
                      title={appliedDiscount ? 'Applied' : 'Apply'}
                      textSize={1.55}
                      textColor={AppColors.WHITE}
                      textFontWeight
                    />
                  )}
                </TouchableOpacity>
              </View>
              {appliedDiscount ? (
                <AppText
                  title={`${
                    discountDetails?.code || discountCode
                  } applied successfully`}
                  textSize={1.45}
                  textColor="#147A3D"
                  mrgnTop={0.8}
                />
              ) : null}
              <LineBreak space={2.5} />
            </View>
          )}

          <AppText
            title={
              reschedule
                ? rescheduleEntireBooking
                  ? 'Services Being Rescheduled'
                  : 'Service Being Rescheduled'
                : 'Price Details'
            }
            textSize={2.2}
            textColor={AppColors.BLACK}
            textFontWeight
          />

          {reschedule ? (
            rescheduleEntireBooking ? (
              <View
                style={{
                  marginTop: responsiveHeight(1.2),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#EEEEEE',
                  paddingHorizontal: responsiveWidth(3.5),
                  paddingVertical: responsiveHeight(1.4),
                  backgroundColor: '#FAFAFA',
                }}>
                {priceRows.map((item, itemIndex) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom:
                        itemIndex === priceRows.length - 1
                          ? 0
                          : responsiveHeight(1),
                    }}>
                    <AppText
                      title={item.title}
                      textSize={1.75}
                      textColor={AppColors.DARKGRAY}
                      textFontWeight={true}
                      numberOfLines={1}
                      styles={{flex: 1, paddingRight: responsiveWidth(3)}}
                    />
                    <AppText
                      title={formatCurrency(item.amount)}
                      textSize={1.75}
                      textColor={AppColors.DARKGRAY}
                      textFontWeight={true}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: responsiveHeight(1.2),
                  paddingBottom: responsiveHeight(1.2),
                  borderBottomWidth: 1,
                  borderBottomColor: '#EEEEEE',
                }}>
                <AppText
                  title={priceRows?.[0]?.title || 'Service'}
                  textSize={1.9}
                  textColor={AppColors.DARKGRAY}
                  numberOfLines={2}
                  styles={{flex: 1, paddingRight: responsiveWidth(3)}}
                />
                <AppText
                  title={formatCurrency(priceRows?.[0]?.amount)}
                  textSize={1.9}
                  textColor={AppColors.BLACK}
                  textFontWeight={true}
                />
              </View>
            )
          ) : (
            <View
              style={{
                marginTop: responsiveHeight(1.2),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#EEEEEE',
                paddingHorizontal: responsiveWidth(3.5),
                paddingVertical: responsiveHeight(1.4),
                backgroundColor: '#FAFAFA',
              }}>
              {priceRows.map((item, itemIndex) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom:
                      itemIndex === priceRows.length - 1
                        ? 0
                        : responsiveHeight(1),
                  }}>
                  <AppText
                    title={item.title}
                    textSize={1.75}
                    textColor={AppColors.DARKGRAY}
                    textFontWeight={true}
                    numberOfLines={1}
                    styles={{flex: 1, paddingRight: responsiveWidth(3)}}
                  />
                  <AppText
                    title={formatCurrency(item.amount)}
                    textSize={1.75}
                    textColor={AppColors.DARKGRAY}
                    textFontWeight={true}
                  />
                </View>
              ))}

              {priceRows.length > 1 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: responsiveHeight(1),
                  }}>
                  <AppText
                    title="Services Subtotal"
                    textSize={1.75}
                    textColor={AppColors.DARKGRAY}
                    numberOfLines={1}
                    styles={{flex: 1, paddingRight: responsiveWidth(3)}}
                  />
                  <AppText
                    title={formatCurrency(originalSubtotal)}
                    textSize={1.75}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: responsiveHeight(1),
                }}>
                <AppText
                  title="Platform Charges"
                  textSize={1.75}
                  textColor={AppColors.DARKGRAY}
                  numberOfLines={1}
                  styles={{flex: 1, paddingRight: responsiveWidth(3)}}
                />
                <AppText
                  title={formatCurrency(displayPlatformCharge)}
                  textSize={1.75}
                  textColor={AppColors.DARKGRAY}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginTop: responsiveHeight(1),
                }}>
                <View style={{flex: 1, paddingRight: responsiveWidth(3)}}>
                  <AppText
                    title="Nail Warz Discount"
                    textSize={1.75}
                    textColor={
                      discountAmount > 0 ? '#147A3D' : AppColors.DARKGRAY
                    }
                    numberOfLines={1}
                  />
                  {discountMetaText ? (
                    <AppText
                      title={discountMetaText}
                      textSize={1.35}
                      textColor="#147A3D"
                      mrgnTop={0.25}
                      numberOfLines={1}
                    />
                  ) : null}
                </View>
                <AppText
                  title={
                    discountAmount > 0
                      ? `-${formatCurrency(discountAmount)}`
                      : formatCurrency(0)
                  }
                  textSize={1.75}
                  textColor={
                    discountAmount > 0 ? '#147A3D' : AppColors.DARKGRAY
                  }
                  textAlignment="right"
                />
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#E6E6E6',
                  marginVertical: responsiveHeight(1.2),
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <AppText
                  title="Total"
                  textSize={2}
                  textColor={AppColors.BLACK}
                  textFontWeight={true}
                />
                <AppText
                  title={formatCurrency(displayTotalAmount)}
                  textSize={2}
                  textColor={AppColors.BLACK}
                  textFontWeight={true}
                />
              </View>
            </View>
          )}

          <LineBreak space={2} />

          <ConfirmationModal
            iconName={'check'}
            title={'Your appointment is confirmed!'}
            subTitle={
              'Thank you for booking through Nail Warz. We look forward to seeing you soon! Please leave a review of your service!'
            }
            buttonOneTitle={'View Receipt'}
            buttonTwoTitle={'Back to Home'}
            handleBackPress={() => {
              navigation.navigate('Home');
              setVisibleConfirmationModal(false);
            }}
            setVisible={() => {
              navigation.navigate('DownloadReceipt', {
                bookingId,
                booking: receiptBooking,
                receiptServices: serviceSchedules,
              });
              setVisibleConfirmationModal(false);
            }}
            visible={visibleConfirmationModal}
          />

          <AppButton
            title={
              rescheduleEntireBooking
                ? 'Reschedule All Services'
                : reschedule
                ? 'Reschedule'
                : isPayWithWallet
                ? 'Pay Now With Wallet'
                : updatePendingBooking
                ? 'Update Appointment'
                : 'Complete Booking'
            }
            handlePress={
              rescheduleEntireBooking
                ? rescheduleEntireBookingHandler
                : reschedule
                ? updateBookingHandler
                : isPayWithWallet
                ? payWithWalletHandler
                : createBookingHandler
            }
            disabled={isLoading || paymentLoading}
            isLoading={isLoading || paymentLoading}
            // bgColor={AppColors.DARKGRAY}
            // textColor={AppColors.WHITE}
          />

          {/* <LineBreak space={2} /> */}
        </View>
        <ConfirmationModal
          iconName={'check'}
          title={'You nail appointment is confirmed!'}
          subTitle={
            'Thank you for your payment. We look forward to seeing you soon.'
          }
          buttonOneTitle={'View Receipt'}
          buttonTwoTitle={'Back to Home'}
          visible={visibleConfirmationModal}
          // setVisible={() => {
          //   navigation.navigate('DownloadReceipt');
          //   setVisibleConfirmationModal(false);
          // }}
          handleBackPress={() => {
            navigation.navigate('Home');
            setVisibleConfirmationModal(false);
          }}
          setVisible={() => {
            navigation.navigate('DownloadReceipt', {
              bookingId,
              booking: receiptBooking,
              receiptServices: serviceSchedules,
            });
            setVisibleConfirmationModal(false);
          }}
        />

        <ConfirmationModal
          iconName={'close'}
          title={'Payment Failed'}
          subTitle={
            'We couldn"t process your payment. Please check your card details or try another payment method.'
          }
          handleBackPress={() => {
            setShowPaymentFailedModal(false);
          }}
          setVisible={() => {
            setShowPaymentFailedModal(false);
          }}
          buttonOneTitle={'Try Again'}
          buttonTwoTitle={'Change Payment Method'}
          isChangeColor={true}
          visible={showPaymentFailedModal}
        />
        <ConfirmationModal
          iconName={'close'}
          title={'Payment Could Not Be Completed'}
          subTitle={paymentErrorModal.message}
          buttonOneTitle={'OK'}
          visible={paymentErrorModal.visible}
          setVisible={() => {
            setPaymentErrorModal({
              visible: false,
              message: '',
            });
          }}
        />
        <ConfirmationModal
          iconName={'close'}
          title={'Discount Code Not Applied'}
          subTitle={discountMessageModal.message}
          buttonOneTitle={'OK'}
          visible={discountMessageModal.visible}
          setVisible={() => {
            setDiscountMessageModal({
              visible: false,
              message: '',
            });
          }}
        />
        <ConfirmationModal
          iconName={'close'}
          title={'Appointment Time Unavailable'}
          subTitle={slotConflictModal.message}
          buttonOneTitle={'Choose New Time'}
          buttonTwoTitle={'Cancel'}
          isChangeColor={true}
          visible={slotConflictModal.visible}
          setVisible={() => {
            const routePayload = slotConflictModal.routePayload;
            setSlotConflictModal({
              visible: false,
              message: '',
              routePayload: null,
            });

            if (routePayload) {
              const params = {
                data: routePayload,
              };

              if (navigation.replace) {
                navigation.replace('DateAndTimeSelection', params);
                return;
              }

              navigation.navigate('DateAndTimeSelection', params);
            }
          }}
          handleBackPress={() => {
            setSlotConflictModal({
              visible: false,
              message: '',
              routePayload: null,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
    // <View>
    //   <Text>kfdj</Text>
    // </View>
  );
};

export default BookingSummary;
