import React, {useState} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
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

const tabs = [
  {id: 1, title: 'Upcoming'},
  {id: 2, title: 'Completed'},
  {id: 3, title: 'Canceled'},
];

const upcomingData = [
  {
    id: 1,
    img: APPImages.NAILS,
    title: 'Nails',
    location: 'Lakewood, California ',
    date: 'Sep 10, 2024 - 9:30 AM',
    service: 'Dip Powder Nails',
  },
  {
    id: 2,
    img: APPImages.CENTRALSALOONS,
    title: 'Central Salon',
    location: 'Lakewood, California ',
    date: 'Sep 10, 2024 - 9:30 AM',
    service: 'Dip Powder Nails',
  },
];

const Booking = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState({id: 1});
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [showSuccessCancelBookingModal, setShowSuccessCancelBookingModal] =
    useState(false);

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
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
              <TouchableOpacity onPress={() => setSelectedTab({id: item.id})}>
                <AppText
                  title={item.title}
                  textSize={2.4}
                  textColor={
                    selectedTab.id === item.id
                      ? AppColors.BTNCOLOURS
                      : AppColors.DARKGRAY
                  }
                  borderBottomWidth={selectedTab.id === item.id ? 3 : 0}
                  borderBottomColor={
                    selectedTab.id === item.id ? AppColors.BTNCOLOURS : null
                  }
                  paddingBottom={responsiveHeight(0.5)}
                />
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={2} />

        {selectedTab.id === 1 && (
          <FlatList
            data={upcomingData}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => {
              return (
                <BookingCard
                  title={item.title}
                  img={item.img}
                  location={item.location}
                  date={item.date}
                  service={item.service}
                  bookingType="up_coming"
                  cancelBookingOnPress={() => setShowCancelBookingModal(true)}
                />
              );
            }}
          />
        )}

        {selectedTab.id === 2 && (
          <FlatList
            data={upcomingData}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => {
              return (
                <BookingCard
                  title={item.title}
                  img={item.img}
                  location={item.location}
                  date={item.date}
                  service={item.service}
                  bookingType="completed"
                />
              );
            }}
          />
        )}

        {selectedTab.id === 3 && (
          <FlatList
            data={upcomingData}
            contentContainerStyle={{gap: 10}}
            renderItem={({item}) => {
              return (
                <BookingCard
                  title={item.title}
                  img={item.img}
                  location={item.location}
                  date={item.date}
                  service={item.service}
                  bookingType="canceled"
                />
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Booking;
