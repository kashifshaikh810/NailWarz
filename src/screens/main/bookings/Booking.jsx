/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import LineBreak from '../../../components/LineBreak';
import AppText from '../../../components/AppTextComps/AppText';
import BookingCard from '../../../components/BookingCard';
import APPImages from '../../../assets/APPImages';
import CancelBookingModal from '../../../components/CancelBookingModal';
import BookingCanceledModal from '../../../components/BookingCanceledModal';
import {
  addReviews,
  cancelBooking,
  getBookingsByIdAndStatus,
} from '../../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../../GlobalFunctions/auth';
import moment from 'moment';

const tabs = [
  {id: 1, title: 'Accepted'},
  {id: 2, title: 'Completed'},
  {id: 3, title: 'Canceled'},
];

// const upcomingData = [
//   {
//     id: 1,
//     img: APPImages.NAILS,
//     title: 'Nails',
//     location: 'Lakewood, California ',
//     date: 'Sep 10, 2024 - 9:30 AM',
//     service: 'Dip Powder Nails',
//   },
//   {
//     id: 2,
//     img: APPImages.CENTRALSALOONS,
//     title: 'Central Salon',
//     location: 'Lakewood, California ',
//     date: 'Sep 10, 2024 - 9:30 AM',
//     service: 'Dip Powder Nails',
//   },
// ];

const Booking = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Accepted');
  const [upcomingData, setUpcomingData] = useState();
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {_id} = useSelector(state => state?.user?.userData);
  const [showSuccessCancelBookingModal, setShowSuccessCancelBookingModal] =
    useState(false);
  console.log('upcomingData', upcomingData);
  const getBookingsHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getBookingsByIdAndStatus(_id, selectedTab);
      console.log('response', response);
      if (response?.success) {
        setUpcomingData(response?.data);
      } else {
        setUpcomingData('');

        ShowToast('error', response.message);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      ShowToast('error', err?.response?.data?.message);
    }
  };

  const handleCancelBooking = async bookingId => {
    setIsLoading(true);
    try {
      const response = await cancelBooking(bookingId);
      console.log('response', response);
      setIsLoading(false);
      if (response?.success) {
        ShowToast('success', response?.message);
      } else {
        ShowToast('error', response?.message);
      }
    } catch (err) {
      setIsLoading(false);
      ShowToast('error', error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getBookingsHandler();
  }, [selectedTab]);
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader onPress={() => navigation.goBack()} title="Bookings" />

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
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors?.BTNCOLOURS} />
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: responsiveWidth(5),
            paddingVertical: responsiveHeight(2),
          }}>
          <FlatList
            data={tabs}
            horizontal
            contentContainerStyle={{gap: 15}}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => setSelectedTab(item.title)}>
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

          {selectedTab === 'Accepted' && (
            <FlatList
              data={upcomingData}
              contentContainerStyle={{gap: 10}}
              renderItem={({item}) => {
                return (
                  <BookingCard
                    title={item?.salonId?.salonName}
                    img={item?.salonId?.image[0]}
                    location={item?.salonId?.location?.locationName}
                    date={moment(item?.date, 'DD-MM-YYYY').format(
                      'ddd, MMM DD',
                    )}
                    saloonId={item?.salonId?._id}
                    service={item?.serviceId?.serviceName}
                    bookingType="up_coming"
                    bookingId={item?._id}
                    cancelBookingOnPress={() => handleCancelBooking(item?._id)}
                  />
                );
              }}
            />
          )}

          {selectedTab === 'Completed' && (
            <FlatList
              data={upcomingData}
              contentContainerStyle={{gap: 10}}
              renderItem={({item}) => {
                return (
                  <BookingCard
                    title={item?.salonId?.salonName}
                    img={item?.salonId?.image[0]}
                    location={item?.salonId?.location?.locationName}
                    date={moment(item?.date, 'DD-MM-YYYY').format(
                      'ddd, MMM DD',
                    )}
                    bookingId={item?._id}
                    saloonId={item?.salonId?._id}
                    service={item?.serviceId?.serviceName}
                    bookingType="completed"
                  />
                );
              }}
            />
          )}

          {selectedTab === 'Canceled' && (
            <FlatList
              data={upcomingData}
              contentContainerStyle={{gap: 10}}
              renderItem={({item}) => {
                return (
                  <BookingCard
                    title={item?.salonId?.salonName}
                    img={item?.salonId?.image[0]}
                    location={item?.salonId?.location?.locationName}
                    date={moment(item?.date, 'DD-MM-YYYY').format(
                      'ddd, MMM DD',
                    )}
                    saloonId={item?.salonId?._id}
                    service={item?.serviceId?.serviceName}
                    bookingType="canceled"
                  />
                );
              }}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default Booking;
