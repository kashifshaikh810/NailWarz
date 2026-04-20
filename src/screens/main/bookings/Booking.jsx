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
import {useIsFocused, useNavigation} from '@react-navigation/native';
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
  const focus = useIsFocused();
  //   useEffect(() => {
  //    getBookingsHandler();
  //  }, [focus]);
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
        // Sort chronologically: earliest date first (DD-MM-YYYY → parse to sortable value)
        const sorted = [...(response?.data || [])].sort((a, b) => {
          const parse = d => moment(d, 'DD-MM-YYYY').valueOf();
          return parse(b?.date) - parse(a?.date);
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
  };

  useEffect(() => {
    if (focus) {
      getBookingsHandler();
    }
  }, [selectedTab, focus]);

  // Helper function to check dispute availability for appointment
  const getDisputeStatus = (appointmentDate, appointmentTime) => {
    try {
      // Parse the appointment date and time
      const appointmentDateTime = moment(
        `${appointmentDate} ${appointmentTime}`,
        'DD-MM-YYYY hh:mm A'
      );
      
      // Get current time
      const now = moment();
      
      // Calculate the difference in hours
      const hoursDifference = now.diff(appointmentDateTime, 'hours');
      
      if (hoursDifference < 0) {
        // Future appointment - not completed yet
        return 'future';
      } else if (hoursDifference >= 0 && hoursDifference <= 24) {
        // Past appointment within 24 hours - can create dispute
        return 'canDispute';
      } else {
        // Past appointment beyond 24 hours - dispute period expired
        return 'expired';
      }
    } catch (error) {
      console.log('Error calculating dispute status:', error);
      return 'expired';
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE, paddingBottom: responsiveHeight(10)}}>
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
      </View>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors?.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {selectedTab === 'Accepted' &&
            (upcomingData?.length > 0 ? (
              <FlatList
                data={upcomingData}
                contentContainerStyle={{flexGrow: 1, gap: 10, margin: 10, marginTop: 0, paddingBottom: responsiveHeight(2)}}
                renderItem={({item}) => {
                  console.log('iterj', item);
                  return (
                    <BookingCard
                      onCardPress={() =>
                        navigation.navigate('BookingDetails', {data: item})
                      }
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
                      cancelBookingOnPress={() =>
                        handleCancelBooking(item?._id)
                      }
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
                contentContainerStyle={{gap: 10, marginTop: 0, paddingHorizontal: responsiveWidth(5), paddingBottom: responsiveHeight(2)}}
                renderItem={({item}) => {
                  // Get dispute status for this appointment
                  const disputeStatus = getDisputeStatus(item?.date, item?.time);
                  
                  return (
                    <BookingCard
                      disabled
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
                      hasDispute={!!item?.dispute}
                      dispute={item?.dispute}
                      disputeStatus={disputeStatus}
                      onDisputePress={() => {
                        if (item?.dispute) {
                          // Always allow viewing existing disputes
                          navigation.navigate('ViewDispute', {
                            bookingData: item,
                            dispute: item?.dispute
                          });
                        } else if (disputeStatus === 'canDispute') {
                          // Only allow creating dispute if within 24 hours
                          navigation.navigate('AddDispute', {
                            bookingData: item
                          });
                        } else if (disputeStatus === 'expired') {
                          ShowToast(
                            'error',
                            'Disputes can only be created within 24 hours of your appointment'
                          );
                        } else {
                          ShowToast(
                            'info',
                            'Disputes can only be filed after your appointment is completed'
                          );
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
            (upcomingData.length > 0 ? (
              <FlatList
                data={upcomingData}
                contentContainerStyle={{gap: 10, marginTop: 0, paddingHorizontal: responsiveWidth(5), paddingBottom: responsiveHeight(2)}}
                renderItem={({item}) => {
                  console.log('itemjhg', item);
                  return (
                    <BookingCard
                      disabled
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
        </View>
      )}
    </ScrollView>
  );
};

export default Booking;
