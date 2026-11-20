/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppTextComps/AppText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SVGXml from '../../components/SVGXML';
import {AppIcons} from './../../assets/Icons/index';
import ConfirmationModal from '../../components/ConfirmationModal';
import {CardField, createPaymentMethod} from '@stripe/stripe-react-native';
import {ShowToast} from '../../GlobalFunctions/auth';
import {
  attachCard,
  createPayment,
  getBookingById,
  getSavedCards,
} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import {formatPaymentMessageDateTimes} from '../../utils/paymentMessages';

const timesData = [
  {id: 1, time: 'Credit/ Debit Card'},
  // {id: 2, time: 'Apple Pay', iconName: 'apple-pay'},
  // {id: 3, time: 'Google Pay'},
];

const SelectPaymentMethod = ({route}) => {
  const navigation = useNavigation();
  const [isSelectedCard, setIsSelectedCard] = useState({id: 1});
  const [cardDetails, setCardDetails] = useState(null);
  const [allCards, setAllCards] = useState();
  const [selectedCard, setSelectedCard] = useState();
  const [isAddNewCard, setIsAddNewCard] = useState(false);
  const {token} = useSelector(state => state?.user);
  const [isLoading, setIsLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const {
    bookingId,
    pay = false,
    serviceDetail,
    servicesDetail,
    salonId,
    saloonId,
  } = route?.params || {};
  const isCheckoutFlow = pay === true;
  console.log('allCards', allCards);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({
    id: 0,
  });
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [paymentErrorModal, setPaymentErrorModal] = useState({
    visible: false,
    message: '',
  });
  const [slotConflictModal, setSlotConflictModal] = useState({
    visible: false,
    message: '',
    routePayload: null,
  });
  const getSavedCardsHandler = useCallback(async () => {
    setCardsLoading(true);
    try {
      const response = await getSavedCards(token);
      console.log('getSavedCards response in SelectPaymentMethod:', response);
      setCardsLoading(false);
      if (response.success) {
        setAllCards(response?.data);
      } else {
        console.log('getSavedCards unsuccessful response:', response);
        ShowToast('error', response?.message);
      }
    } catch (error) {
      console.log(
        'getSavedCards error in SelectPaymentMethod:',
        error?.response?.data || error?.message || error,
      );
      setCardsLoading(false);
      ShowToast('error', error?.response?.data?.message);
    }
  }, [token]);
  const attachCardToUser = async paymentMethodId => {
    try {
      const response = await attachCard(paymentMethodId, token);
      console.log('attachCard response in SelectPaymentMethod:', response);
      setIsLoading(false);
      if (response?.success) {
        getSavedCardsHandler();
        return ShowToast('success', 'Card Added Successfully');
      } else {
        console.log('attachCard unsuccessful response:', response);
        return ShowToast('error', response?.message);
      }
    } catch (error) {
      console.log(
        'attachCard error in SelectPaymentMethod:',
        error?.response?.data || error?.message || error,
      );
      setIsLoading(false);
      return ShowToast('error', error?.response?.data?.message);
    }
  };
  const handleAddCard = async () => {
    if (isLoading) {
      return;
    }

    if (!cardDetails?.complete) {
      ShowToast('error', 'Please enter complete or valid card details');
      return;
    }

    try {
      setIsLoading(true);
      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
      });
      console.log('createPaymentMethod response in SelectPaymentMethod:', {
        paymentMethod,
        error,
      });
      if (error) {
        setIsLoading(false);
        return ShowToast('error', error?.message);
      } else {
        attachCardToUser(paymentMethod.id);
      }
    } catch (err) {
      setIsLoading(false);
      ShowToast('error', err);
      console.log(err);
    }
  };

  const getPaymentErrorMessage = error => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      ''
    );
  };

  const isSlotAlreadyBookedError = error => {
    const message = getPaymentErrorMessage(error).toLowerCase();

    return (
      message.includes('already been booked') ||
      (message.includes('time slot') && message.includes('booked'))
    );
  };

  const getServiceDetailId = detail => detail?._id || detail?.slotId;

  const getServiceId = detail => {
    return detail?.service?._id || detail?.service || detail?.serviceId;
  };

  const getServiceName = detail => {
    return detail?.serviceName || detail?.service?.serviceName;
  };

  const getScheduledAt = detail => detail?.scheduledAt || detail?.formattedTime;

  const getTechnician = detail => {
    return detail?.technician && typeof detail.technician === 'object'
      ? detail.technician
      : null;
  };

  const getConflictServiceText = message => {
    const match = `${message || ''}`.match(/time slot for (.*?) has already/i);
    return match?.[1]?.trim();
  };

  const findConflictedServiceDetails = (bookingData, errorMessage) => {
    const bookingServices = Array.isArray(bookingData?.servicesDetail)
      ? bookingData.servicesDetail
      : [];
    const serviceText = getConflictServiceText(errorMessage);

    if (!serviceText) {
      return bookingServices;
    }

    const normalizedServiceText = serviceText.toLowerCase();
    const matchedServices = bookingServices.filter(detail => {
      return `${getServiceName(detail) || ''}`
        .toLowerCase()
        .includes(normalizedServiceText);
    });

    return matchedServices.length ? matchedServices : bookingServices;
  };

  const getBackendConflictDetails = error => {
    const responseData = error?.response?.data;
    if (Array.isArray(responseData?.conflictingSlots)) {
      return responseData.conflictingSlots;
    }

    return Array.isArray(responseData?.existingServiceDetail)
      ? responseData.existingServiceDetail
      : [];
  };

  const isSameConflictService = (bookingService, conflictService) => {
    const bookingSlotId = getServiceDetailId(bookingService);
    const conflictSlotId = getServiceDetailId(conflictService);

    if (bookingSlotId && conflictSlotId) {
      return bookingSlotId === conflictSlotId;
    }

    const bookingName = `${getServiceName(bookingService) || ''}`
      .trim()
      .toLowerCase();
    const conflictName = `${getServiceName(conflictService) || ''}`
      .trim()
      .toLowerCase();
    const bookingScheduledAt = getScheduledAt(bookingService);
    const conflictScheduledAt = getScheduledAt(conflictService);

    return (
      Boolean(bookingName) &&
      bookingName === conflictName &&
      Boolean(bookingScheduledAt) &&
      bookingScheduledAt === conflictScheduledAt
    );
  };

  const buildConflictScheduleRouteData = (
    bookingData,
    errorMessage,
    backendConflictDetails = [],
  ) => {
    const bookingServices = Array.isArray(bookingData?.servicesDetail)
      ? bookingData.servicesDetail
      : [];
    const conflictedDetails = backendConflictDetails.length
      ? backendConflictDetails
      : findConflictedServiceDetails(bookingData, errorMessage);
    const resolvedSalonId =
      bookingData?.salonId?._id || bookingData?.salonId || salonId || saloonId;
    const serviceTechnicianSelections = bookingServices
      .map((detail, index) => {
        const technician = getTechnician(detail);
        const technicianId = technician?._id || detail?.technician;
        const serviceId = getServiceId(detail);

        if (!serviceId || !technicianId) {
          return null;
        }

        return {
          scheduleKey: `${serviceId}-${getServiceDetailId(detail) || index}`,
          serviceId,
          slotId: getServiceDetailId(detail),
          serviceName: getServiceName(detail),
          salonId: resolvedSalonId,
          price: detail?.price ?? detail?.service?.price,
          scheduledAt: detail?.scheduledAt,
          selectedTechnicianId: technicianId,
          selectedTechnicianName:
            technician?.fullName || detail?.technicianName,
          selectedTechnician: technician || { _id: technicianId },
          durationMinutes:
            detail?.durationMinutes ||
            detail?.duration ||
            detail?.service?.durationMinutes ||
            detail?.service?.duration ||
            30,
          isConflicted: conflictedDetails.some(conflictDetail =>
            isSameConflictService(detail, conflictDetail),
          ),
        };
      })
      .filter(Boolean);

    return {
      salonId: resolvedSalonId,
      saloonId: resolvedSalonId,
      isMultiService: true,
      source: 'paymentSlotConflict',
      updatePendingBooking: true,
      updateBookingId: bookingId,
      existingServiceDetail: bookingData?.servicesDetail || [],
      conflictedServiceDetail: conflictedDetails,
      paymentConflictMessage: errorMessage,
      serviceTechnicianSelections,
      totalPrice: serviceTechnicianSelections.reduce(
        (total, service) => total + (Number(service?.price) || 0),
        0,
      ),
    };
  };

  const resolveBookingForPaymentConflict = async () => {
    const routeServiceDetail = Array.isArray(serviceDetail)
      ? serviceDetail
      : Array.isArray(servicesDetail)
      ? servicesDetail
      : null;

    try {
      const bookingResponse = await getBookingById(bookingId);
      const bookingData = bookingResponse?.data || bookingResponse?.booking;

      if (Array.isArray(bookingData?.servicesDetail)) {
        return bookingData;
      }
    } catch (error) {
      console.log(
        'getBookingById failed for payment slot conflict:',
        error?.response?.data || error?.message || error,
      );
    }

    return {
      _id: bookingId,
      salonId: salonId || saloonId,
      servicesDetail: routeServiceDetail || [],
    };
  };

  const routeToSlotConflictReselection = async error => {
    if (!isSlotAlreadyBookedError(error) || !bookingId) {
      return false;
    }

    try {
      const errorMessage = getPaymentErrorMessage(error);
      const bookingData = await resolveBookingForPaymentConflict();
      const backendConflictDetails = getBackendConflictDetails(error);
      const routePayload = buildConflictScheduleRouteData(
        bookingData,
        errorMessage,
        backendConflictDetails,
      );

      console.log('payment slot conflict schedule route payload:', routePayload);
      console.log('payment slot conflict summary:', {
        totalServicesAvailableToChange:
          routePayload.serviceTechnicianSelections.length,
        conflictedServices:
          routePayload.serviceTechnicianSelections.filter(
            service => service?.isConflicted,
          ).length,
        backendConflictingSlots: backendConflictDetails.length,
      });

      if (!routePayload.serviceTechnicianSelections.length) {
        return false;
      }

      setSlotConflictModal({
        visible: true,
        message:
          formatPaymentMessageDateTimes(errorMessage) ||
          'This appointment time is no longer available. Please choose another available time.',
        routePayload,
      });
      return true;
    } catch (routeError) {
      console.log(
        'payment slot conflict route error:',
        routeError?.response?.data || routeError?.message || routeError,
      );
      return false;
    }
  };

  const createPaymentHandler = async () => {
    if (isLoading) {
      return;
    }

    if (!isCheckoutFlow) {
      return ShowToast('success', 'Payment method saved.');
    }
    if (!selectedCard) {
      return ShowToast('error', 'Please Select A Payment Method To Proceed');
    }
    if (!bookingId) {
      return ShowToast('error', 'Booking details are missing.');
    }
    setIsLoading(true);
    try {
      console.log('createPaymentIntent request payload:', {
        bookingId,
        currency: 'usd',
        saveCard: true,
        paymentMethodId: selectedCard?.paymentMethodId,
      });
      const response = await createPayment(
        bookingId,
        'usd',
        true,
        selectedCard?.paymentMethodId,
        token,
      );
      setIsLoading(false);
      console.log('createPaymentIntent API response:', response);
      if (response?.success) {
        setVisibleConfirmationModal(true);
        // ShowToast('success', response?.message);
      } else {
        setPaymentErrorModal({
          visible: true,
          message:
            formatPaymentMessageDateTimes(response?.message) ||
            'We could not process your payment. Please try again.',
        });
        // ShowToast('error', response?.message);
      }
    } catch (error) {
      console.log(
        'createPaymentIntent API error:',
        error?.response?.data || error?.message || error,
      );
      const handledSlotConflict = await routeToSlotConflictReselection(error);
      setIsLoading(false);
      if (!handledSlotConflict) {
        setPaymentErrorModal({
          visible: true,
          message:
            formatPaymentMessageDateTimes(getPaymentErrorMessage(error)) ||
            'We could not process your payment. Please try again.',
        });
      }
    }
  };
  useEffect(() => {
    getSavedCardsHandler();
  }, [getSavedCardsHandler]);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        style={{flex: 1, backgroundColor: AppColors.APPBG}}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(10),
        }}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title={isCheckoutFlow ? 'Select Payment Method' : 'Payment Method'}
        />

        <View
          style={{
            paddingHorizontal: responsiveWidth(5),
            marginVertical: responsiveHeight(2),
          }}>
          <FlatList
            data={timesData}
            contentContainerStyle={{gap: 15}}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: AppColors.WHITE,
                    borderRadius: 10,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveHeight(3),
                    gap: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}
                      onPress={() => setIsSelectedCard({id: item.id})}>
                      <Fontisto
                        name={
                          isSelectedCard.id === item.id
                            ? 'radio-btn-active'
                            : 'radio-btn-passive'
                        }
                        size={responsiveFontSize(2.5)}
                        color={
                          isSelectedCard.id === item.id
                            ? AppColors.BLUE
                            : AppColors.DARKGRAY
                        }
                      />
                      <AppText
                        title={item.time}
                        textSize={2.2}
                        textColor={AppColors.BLACK}
                        textFontWeight
                      />
                    </TouchableOpacity>
                    {item.iconName ? (
                      <Fontisto
                        name={item.iconName}
                        size={responsiveFontSize(3.5)}
                        color={AppColors.BLACK}
                      />
                    ) : (
                      item.id == 3 && (
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: AppColors.DARKGRAY,
                            paddingHorizontal: 7,
                            borderRadius: 5,
                          }}>
                          <SVGXml
                            width={'27'}
                            height={'27'}
                            icon={AppIcons.Google_Pay}
                          />
                        </View>
                      )
                    )}
                  </View>

                  {isSelectedCard.id == 1 && index == 0 && (
                    <View>
                      {/* <LineBreak space={1.5} /> */}
                      {cardsLoading ? (
                        <View
                          style={{
                            height: responsiveHeight(10),
                            justifyContent: 'center',
                          }}>
                          <ActivityIndicator
                            size={'large'}
                            color={AppColors.BTNCOLOURS}
                          />
                        </View>
                      ) : (
                        <FlatList
                          data={allCards}
                          renderItem={({item, index}) => {
                            return (
                              <TouchableOpacity
                                onPress={() => setSelectedCard(item)}
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  justifyContent: 'space-between',
                                  gap: 10,
                                  marginTop: responsiveHeight(2),
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      borderWidth: 1,
                                      borderColor: AppColors.DARKGRAY,
                                      paddingHorizontal: 7,
                                      borderRadius: 5,
                                    }}>
                                    <SVGXml
                                      width={'27'}
                                      height={'27'}
                                      icon={AppIcons[item?.brand]}
                                    />
                                  </View>
                                  <AppText
                                    title={`**** ${item?.last4}`}
                                    textSize={2}
                                    textColor={AppColors.BLACK}
                                  />
                                </View>
                                <Fontisto
                                  name={
                                    selectedCard?.paymentMethodId ===
                                    item.paymentMethodId
                                      ? 'radio-btn-active'
                                      : 'radio-btn-passive'
                                  }
                                  size={responsiveFontSize(2.5)}
                                  color={
                                    selectedCard?.paymentMethodId ===
                                    item.paymentMethodId
                                      ? AppColors.BLUE
                                      : AppColors.DARKGRAY
                                  }
                                />
                              </TouchableOpacity>
                            );
                          }}
                        />
                      )}
                      {isAddNewCard && (
                        <View>
                          <LineBreak space={2} />
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <AppText
                              title="Add New Card"
                              textSize={2}
                              textColor={AppColors.BLACK}
                              textFontWeight
                            />
                            <TouchableOpacity
                              onPress={() => setIsAddNewCard(false)}>
                              <AntDesign
                                name={'close'}
                                size={responsiveFontSize(2.5)}
                                color={AppColors.BLACK}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      {!isAddNewCard ? (
                        <View>
                          <LineBreak space={2} />
                          <TouchableOpacity
                            onPress={() => setIsAddNewCard(true)}
                            style={{flexDirection: 'row', gap: 5}}>
                            <Entypo
                              name={'plus'}
                              size={responsiveFontSize(2.5)}
                              color={AppColors.BLUE}
                            />
                            <AppText
                              title="Add Card"
                              textSize={1.8}
                              textColor={AppColors.BLUE}
                              textFontWeight
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}

                      {/* <LineBreak space={1} /> */}
                      {/* <View>
                      <AppTextInput
                        containerBg="#f5f5f5"
                        inputPlaceHolder={'Card Number'}
                      />
                      <LineBreak space={1.5} />
                      <View style={{flexDirection: 'row', gap: 10}}>
                        <AppTextInput
                          containerBg="#f5f5f5"
                          inputPlaceHolder={'MM/YY'}
                          inputWidth={20}
                        />
                        <AppTextInput
                          containerBg="#f5f5f5"
                          inputPlaceHolder={'CVC'}
                          inputWidth={20}
                        />
                      </View>
                      <LineBreak space={1.5} />
                      <AppTextInput
                        containerBg="#f5f5f5"
                        inputPlaceHolder={'Card Holder Name'}
                      />
                    </View> */}
                      {isAddNewCard && (
                        <CardField
                          postalCodeEnabled={false}
                          onCardChange={card => setCardDetails(card)}
                          placeholder={{
                            number: '4242 4242 4242 4242',
                          }}
                          cardStyle={{
                            backgroundColor: '#f5f5f5', // light gray background
                            textColor: '#000000', // text color
                            borderRadius: 12, // rounded corners
                            fontSize: 16, // font size
                            placeholderColor: '#a9a9a9', // placeholder color
                            borderColor: '#d3d3d3',
                          }}
                          style={{
                            width: '100%',
                            height: 55,
                            marginVertical: 20,
                            borderRadius: 12,
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />

          {/* <LoadingModal /> */}
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
              navigation.navigate('DownloadReceipt', {bookingId});
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

          {isCheckoutFlow || isAddNewCard ? (
            <>
              <LineBreak space={4} />

              <AppButton
                disabled={isLoading || (isAddNewCard && !cardDetails?.complete)}
                isLoading={isLoading}
                title={isAddNewCard ? 'Save Card' : 'Pay Now'}
                handlePress={
                  isAddNewCard ? handleAddCard : createPaymentHandler
                }
                bgColor={isAddNewCard && !cardDetails?.complete && '#CCCCCC'}
                //   textColor={AppColors.WHITE}
              />
            </>
          ) : null}

          <LineBreak space={2} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectPaymentMethod;
