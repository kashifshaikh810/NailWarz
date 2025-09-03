/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
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
import AppTextInput from '../../components/AppTextInput';
import LoadingModal from '../../components/LoadingModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import {CardField, createPaymentMethod} from '@stripe/stripe-react-native';
import {ShowToast} from '../../GlobalFunctions/auth';
import {attachCard, createPayment, getSavedCards} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';

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
  const {bookingId, price} = route?.params;
  console.log('setSelectedCard', selectedCard);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({
    id: 0,
  });
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const getSavedCardsHandler = async () => {
    setCardsLoading(true);
    try {
      const response = await getSavedCards(token);
      setCardsLoading(false);
      if (response.success) {
        setAllCards(response?.data);
      } else {
        ShowToast('error', response?.message);
      }
    } catch (error) {
      setCardsLoading(false);
      ShowToast('error', error?.response?.data?.message);
    }
  };
  const attachCardToUser = async paymentMethodId => {
    const response = await attachCard(paymentMethodId, token);
    setIsLoading(false);
    if (response?.success) {
      getSavedCardsHandler();
      return ShowToast('success', 'Card Added Successfully');
    } else {
      return ShowToast('error', response?.message);
    }
  };
  const handleAddCard = async () => {
    if (!cardDetails?.complete) {
      ShowToast('error', 'Please enter complete or valid card details');
      return;
    }

    try {
      setIsLoading(true);
      const {paymentMethod, error} = await createPaymentMethod({
        paymentMethodType: 'Card',
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

  const createPaymentHandler = async () => {
    if (!selectedCard) {
      return ShowToast('error', 'Please Select A Payment Method To Proceed');
    }
    setIsLoading(true);
    try {
      const response = await createPayment(
        bookingId,
        price,
        'usd',
        true,
        selectedCard?.paymentMethodId,
        token,
      );
      setIsLoading(false);
      if (response?.success) {
        setVisibleConfirmationModal(true);
        // ShowToast('success', response?.message);
      } else {
        setShowPaymentFailedModal(true);
        // ShowToast('error', response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      ShowToast('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getSavedCardsHandler();
  }, []);
  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title="Select payment method"
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
                      <View style={{height:responsiveHeight(10),justifyContent:'center'}}>
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
                    {/* <LineBreak space={3} />

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        gap: 10,
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
                            backgroundColor: AppColors.BLUE,
                            paddingHorizontal: 7,
                            borderRadius: 5,
                          }}>
                          <SVGXml
                            width={'27'}
                            height={'27'}
                            icon={AppIcons.visa}
                          />
                        </View>
                        <AppText
                          title="**** 2345"
                          textSize={2}
                          textColor={AppColors.BLACK}
                        />
                      </View>
                      <Fontisto
                        name={'radio-btn-passive'}
                        size={responsiveFontSize(2.5)}
                        color={AppColors.DARKGRAY}
                      />
                    </TouchableOpacity> */}

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

        <LineBreak space={4} />

        <AppButton
          title={
            isLoading ? (
              <ActivityIndicator size={'large'} color={AppColors.WHITE} />
            ) : isAddNewCard ? (
              'Save Card'
            ) : (
              'Pay Now'
            )
          }
          handlePress={isAddNewCard ? handleAddCard : createPaymentHandler}
          //   bgColor={AppColors.DARKGRAY}
          //   textColor={AppColors.WHITE}
        />

        <LineBreak space={2} />
      </View>
    </ScrollView>
  );
};

export default SelectPaymentMethod;
