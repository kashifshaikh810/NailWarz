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
import {createBooking, getSaloonById} from '../../GlobalFunctions';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';
import ConfirmationModal from '../../components/ConfirmationModal';

// const pricingDetails = [
//   {id: 1, title: 'Dip Powder Nails', amount: '$10.00'},
//   {id: 2, title: 'Dip Powder Nails', amount: '$5.00'},
//   {id: 3, title: 'Discount', amount: '$3.00'},
//   {id: 4, title: 'Total', amount: '$12.00'},
// ];

const BookingSummary = ({route}) => {
  const navigation = useNavigation();
  const [paymentType, setPaymentType] = useState({id: 2});
  const [saloonData, setSaloonData] = useState();
  const {_id} = useSelector(state => state?.user?.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [saloonLoading, setSaloonLoading] = useState(false);
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({
    id: 0,
  });
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
  } = route?.params?.data;
  const time12hr = selectedTime?.value;
  const time24hr = moment(time12hr, ['h:mm A']).format('HH:mm');
  const [bookingId, setBookingId] = useState();
  console.log('serviceId', serviceId);
  console.log('selectedDate', selectedDate);
  console.log('selectedDay', selectedDay);
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
    {id: 2, title: 'Stylist', date: `${technicianName} - 30 Mins`},
  ];

  const paymentDetails = [
    {id: 1, title: 'Pay Online Now', subTitle: 'Secure your booking instantly'},
    {
      id: 2,
      title: 'Pay at Salon',
      subTitle: 'Settle payment after your appointment',
    },
  ];
  const getSaloonByIdHandler = async () => {
    setSaloonLoading(true);
    const response = await getSaloonById(saloonId);
    setSaloonLoading(false);
    setSaloonData(response.data);
  };
  const createBookingHandler = async () => {
    setIsLoading(true);
    try {
      const response = await createBooking(
        _id,
        saloonId,
        serviceId,
        selectedTechnician,
        selectedBookingDate,
        selectedTime.value,
      );
      setIsLoading(false);
      console.log('response', response);

      if (response?.success) {
        setVisibleConfirmationModal(true);
        setBookingId(response?.data?._id);
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
  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title="Booking Summary" />
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
        <View style={{height: responsiveHeight(10), justifyContent: 'center'}}>
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
            },
          ]}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => {
            return (
              <SaloonsCard
                showDeleteCard={false}
                title={item.title}
                KM={item.KM}
                textWidth={55}
                saloonId={saloonId}
                Rating={item.Rating}
                TotalNoOfRating={item.TotalNoOfRating}
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
          title="Booking details"
          textSize={2.5}
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

        <LineBreak space={4} />

        <AppText
          title="Payment"
          textSize={2.5}
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
                  item?.id === 1 ? Alert.alert('Under Development') : null;
                  setPaymentType({id: 2});
                }}>
                <View>
                  <AppText
                    title={item.title}
                    textSize={2}
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
                    paymentType.id === item.id
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

        <LineBreak space={4} />

        <AppText
          title="Price Details"
          textSize={2.5}
          textColor={AppColors.BLACK}
          textFontWeight
        />

        <LineBreak space={1.5} />

        {/* <FlatList
          data={pricingDetails}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => {
            return (
            );
          }}
        /> */}

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <AppText
            title={serviceName}
            textSize={2}
            textColor={AppColors.DARKGRAY}
            textFontWeight={true}
          />
          <AppText
            title={`$${price}`}
            textSize={2}
            textColor={AppColors.DARKGRAY}
            textFontWeight={true}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <AppText
            title={'Total'}
            textSize={2.5}
            textColor={AppColors.BLACK}
            textFontWeight={true}
          />
          <AppText
            title={`$${price}`}
            textSize={2.5}
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
          visible={visibleConfirmationModal}
          setVisible={() => {
            navigation.navigate('DownloadReceipt', {bookingId});
            setVisibleConfirmationModal(false);
          }}
        />

        <AppButton
          title={
            isLoading ? (
              <ActivityIndicator size={'large'} color={AppColors.WHITE} />
            ) : (
              'Proceed'
            )
          }
          handlePress={createBookingHandler}
          // bgColor={AppColors.DARKGRAY}
          // textColor={AppColors.WHITE}
        />

        <LineBreak space={2} />
      </View>
    </ScrollView>
  );
};

export default BookingSummary;
