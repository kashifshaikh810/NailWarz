/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import SaloonsCard from '../../components/SaloonsCard';
import APPImages from '../../assets/APPImages';
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
  updateBooking,
} from '../../GlobalFunctions';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';
import ConfirmationModal from '../../components/ConfirmationModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

// const pricingDetails = [
//   {id: 1, title: 'Dip Powder Nails', amount: '$10.00'},
//   {id: 2, title: 'Dip Powder Nails', amount: '$5.00'},
//   {id: 3, title: 'Discount', amount: '$3.00'},
//   {id: 4, title: 'Total', amount: '$12.00'},
// ];

const BookingSummary = ({route}) => {
  const navigation = useNavigation();
  const [paymentType, setPaymentType] = useState('online');
  const [saloonData, setSaloonData] = useState();
  const {_id} = useSelector(state => state?.user?.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [saloonLoading, setSaloonLoading] = useState(false);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({
    id: 0,
  });
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const {
    saloonId,
    selectedTechnician,
    serviceId,
    selectedBookingDate,
    technicianName,
    serviceName,
    price,
    selectedTime,
    selectedDate,
    selectedDay,
    reschedule,
    myBookingId,
  } = route?.params?.data;
  const time12hr = selectedTime?.value;
  const time24hr = moment(time12hr, ['h:mm A']).format('HH:mm');
  const [activePaymentMethod, setActivePaymentMethod] = useState(1);
  const [bookingId, setBookingId] = useState();
  const [walletDetails, setWalletDetails] = useState();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPayWithWallet, setIsPayWithWallet] = useState(false);
  const {token} = useSelector(state => state.user);
  const momentDay = moment().day();
  const index = momentDay === 0 ? 6 : momentDay - 1;
  console.log('saloonData', saloonData);
  console.log('selectedDate', selectedDate);
  console.log('route?.params', route?.params);
  console.log('selectedTime===>>>>>>', selectedTime);
  // selectedTime: isSelectedTime,
  //               selectedDate: isSelectedDate?.date,
  //               selectedDay: isSelectedDate?.day,
  //               selectedBookingDate: isSelectedDate?.formattedDate,
  const bookingDetails = [
    {
      id: 1,
      title: 'Date',
      date: `${selectedDay} ${selectedDate} at ${selectedTime?.value}`,
    },
    {id: 2, title: 'Nail Technician', date: `${technicianName} - 30 Mins`},
  ];
  const paymentDetails = [
    {id: 1, title: 'Pay Online Now', subTitle: 'Secure your booking instantly'},
    {
      id: 2,
      title: 'Pay With Wallet',
      subTitle: 'Pay conveniently using your wallet balance',
    },
  ];
  const getSaloonByIdHandler = async () => {
    setSaloonLoading(true);
    const response = await getSaloonById(saloonId);
    setSaloonLoading(false);
    setSaloonData(response.data);
  };
  const updateBookingHandler = async () => {
    setIsLoading(true);
    try {
      const response = await updateBooking(
        myBookingId,
        selectedTechnician,
        selectedTime.value,
        selectedBookingDate,
      );
      setIsLoading(false);
      if (response.success) {
        ShowToast('success', 'Appointment Rescheduled Successfully');
        navigation.navigate('Home');
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      setIsLoading(false);
      return ShowToast('error', error?.response?.data?.message);
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
  const payWithWalletHandler = async () => {
    setPaymentLoading(true);
    try {
      const response = await payWithWallet(_id, bookingId, price - 1);
      setPaymentLoading(false);
      if (response.success) {
        // ShowToast('success', response.message);
        setIsPayWithWallet(false);
        setVisibleConfirmationModal(true);
        getWalletHandler();
      } else {
        setIsPayWithWallet(false);
        setShowPaymentFailedModal(true);
      }
      console.log('response', response);
    } catch (error) {
      setPaymentLoading(false);
      setIsPayWithWallet(false);
      setShowPaymentFailedModal(true);
      ShowToast('error', error?.response?.data?.message);
    }
  };
  const createBookingHandler = async () => {
    if (activePaymentMethod === 2) {
      if (price > walletDetails?.balance) {
        return ShowToast('error', 'Insufficient Wallet Balance');
      }
    }
    setIsLoading(true);
    try {
      const response = await createBooking(
        _id,
        saloonId,
        serviceId,
        selectedTechnician,
        selectedBookingDate,
        selectedTime.value,
        price - 1,
      );
      setIsLoading(false);
      console.log('response', response);

      if (response?.success) {
        if (!reschedule) {
          if (activePaymentMethod === 1) {
            navigation.navigate('SelectPaymentMethod', {
              bookingId: response?.data?._id,
              price: price,
              pay: true,
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
      ShowToast('error', err?.response?.data?.message);
      setIsLoading(false);
      throw err;
    }
  };
  useEffect(() => {
    getSaloonByIdHandler();
  }, []);

  useEffect(() => {
    getWalletHandler();
  }, []);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
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
                  <AppText
                    title={item.date}
                    textSize={1.7}
                    textColor={AppColors.DARKGRAY}
                  />
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
                title={`$ ${walletDetails?.balance || '0'}.00`}
                textSize={1.7}
                textColor={AppColors.DARKGRAY}
              />
            </View>
          ) : null}
          <LineBreak space={4} />

          <AppText
            title="Price Details"
            textSize={2.2}
            textColor={AppColors.BLACK}
            textFontWeight
          />

          {/* <LineBreak space={1.5} /> */}

          {/* <FlatList
          data={pricingDetails}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => {
            return (
            );
          }}
        /> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <AppText
              title={serviceName}
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
            <AppText
              title={`$${price}`}
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <AppText
              title="Platform Charges"
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
            <AppText
              title="$5"
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <AppText
              title="Discount"
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
            <AppText
              title="$6"
              textSize={1.9}
              textColor={AppColors.DARKGRAY}
              textFontWeight={true}
            />
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <AppText
              title={'Total'}
              textSize={2}
              textColor={AppColors.BLACK}
              textFontWeight={true}
            />
            <AppText
              title={`$${price - 1}`}
              textSize={2}
              textColor={AppColors.BLACK}
              textFontWeight={true}
            />
          </TouchableOpacity>

          <LineBreak space={4} />

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
              navigation.navigate('DownloadReceipt', {bookingId});
              setVisibleConfirmationModal(false);
            }}
            visible={visibleConfirmationModal}
          />

          <AppButton
            title={
              isLoading || paymentLoading ? (
                <ActivityIndicator size={'large'} color={AppColors.WHITE} />
              ) : reschedule ? (
                'Reschedule'
              ) : isPayWithWallet ? (
                'Pay Now With Wallet'
              ) : (
                'Complete Booking'
              )
            }
            handlePress={
              // payWithWalletHandler(response?.data?._id, price);
              reschedule
                ? updateBookingHandler
                : isPayWithWallet
                ? payWithWalletHandler
                : createBookingHandler
            }
            // bgColor={AppColors.DARKGRAY}
            // textColor={AppColors.WHITE}
          />

          <LineBreak space={2} />
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
      </ScrollView>
    </SafeAreaView>
    // <View>
    //   <Text>kfdj</Text>
    // </View>
  );
};

export default BookingSummary;
