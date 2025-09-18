/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Platform, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import AppText from '../../components/AppTextComps/AppText';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/Responsive_Dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import CalendarModal from '../../components/CalendarModal';
import moment from 'moment';
import LineBreak from '../../components/LineBreak';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppButton from '../../components/AppButton';
import { getAvailableTechnician } from '../../GlobalFunctions';
import { ShowToast } from '../../GlobalFunctions/auth';
import { ImageBaseUrl } from '../../BaseUrl';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../GlobalFunctions/styles';
const SelectAnyTech = ({ navigation, route }) => {
  const { data } = route?.params;
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState('');
  const [selectedDate, setSelectedDate] = useState({ day: '', fullDay: '', date: '' });
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [technicianDetails, setTechnicianDetails] = useState({
    _id: '',
    name: '',
    designation: '',
    image: '',
  });
  const { _id } = useSelector(state => state?.user?.userData);
  console.log('data', data);
  console.log('technicianDetails', technicianDetails);

  const handleDateSelection = (dateStr) => {
    setSelectedDateFromCalendar(dateStr); // stores raw "YYYY-MM-DD"
    const formatted = formatSelectedDate(dateStr); // moment formatting
    setSelectedDate(formatted); // stores { day: "Tue", date: "Jul 15" }
  };
  const formatSelectedDate = (dateStr) => {
    if (!dateStr) { return { day: '', date: '' }; }
    console.log('date====>><><><>>...,,,', dateStr);
    return {
      day: moment(dateStr).format('ddd'),
      fullDay: moment(dateStr).format('dddd'),
      date: moment(dateStr).format('MMM D'),
    };
  };
  const handleTimeChange = (event, time) => {
    if (time) {
      setSelectedTime(time);
    }
    setShowPicker(false); // Close the picker
  };

  const getTechnicianHandler = async () => {
    setIsLoading(true);
    try {
      const formattedTime = moment(selectedTime).format('hh:mm A');
      const formattedDate = moment(selectedDateFromCalendar).format('DD-MM-YYYY');
      const serviceId = data?.serviceId;
      const response = await getAvailableTechnician(serviceId, formattedDate, formattedTime);
      setIsLoading(false);

      console.log('response', response);
      if (response.success) {
        setTechnicians(response?.data);
      } else {
        ShowToast('error', response.message);
        setTechnicians([]);
        setTechnicianDetails({
          _id: '',
          name: '',
          designation: '',
          image: '',
        });

      }
    } catch (error) {
      setIsLoading(false);

      return ShowToast('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (technicians?.length > 0) {
      const randomIndex = Math.floor(Math.random() * technicians.length);
      const randomTechnicianName = technicians[randomIndex].fullName;
      const randomTechnicianDesignation = technicians[randomIndex].designation;
      const randomTechnicianImage = technicians[randomIndex].image;
      setTechnicianDetails({
        _id: technicians[randomIndex]._id,
        name: randomTechnicianName,
        image: randomTechnicianImage,
        designation: randomTechnicianDesignation,
      });
      console.log('Random Technician Name:', randomTechnicianName);
    }
  }, [technicians]);
  useEffect(() => {
    if (selectedDateFromCalendar && selectedTime) {
      getTechnicianHandler();
    }
  }, [selectedDateFromCalendar, selectedTime]);

  const handleNavigation = () => {
    navigation.navigate('BookingSummary', {
      data: {
        ...data,
        selectedTechnician: technicianDetails?._id,
        technicianName: technicianDetails?.name,
        selectedTime: { value: moment(selectedTime).format('hh:mm A') },
        selectedDate: selectedDate.date,
        selectedDay: selectedDate.fullDay,
        selectedBookingDate: moment(selectedDateFromCalendar).format('DD-MM-YYYY'),
      },
    }
    );
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title="Date and time" />
      <View
        style={{
          backgroundColor: '#B4B4B4',
          height: 0.5,
          elevation: 5,
          width: '100%',
        }}
      />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{ padding: responsiveHeight(2), flex: 1 }}>
          <AppText
            // mrgnLeft={2}
            // mrgnTop={2}
            title="Select Date"
            textSize={2.5}
            textColor={AppColors.BLACK}
            textFontWeight
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(2), gap: responsiveHeight(2) }}>
            {selectedDate.date ? (
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.WHITE,
                  elevation: 6,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingHorizontal: responsiveWidth(3.4),
                  paddingVertical: 10,
                  borderWidth: 2,
                  borderColor: AppColors.BLUE,
                }}>
                <AppText
                  title={selectedDate.day}
                  textSize={1.7}
                  textColor={AppColors.BLUE}
                  textFontWeight
                />
                <LineBreak space={0.3} />
                <AppText
                  title={selectedDate.date}
                  textSize={1.5}
                  textColor={AppColors.BLUE
                  }
                  textFontWeight
                />
                <LineBreak space={0.3} />
                <AppText
                  title="30 mins"
                  textSize={1.3}
                  textColor={AppColors.BLUE
                  }
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={{
                backgroundColor: AppColors.WHITE,
                elevation: 6,
                borderRadius: 10,
                alignItems: 'center',
                // paddingHorizontal: responsiveWidth(3.4),
                paddingVertical: 10,
                width: responsiveWidth(16),
                height: responsiveHeight(9.5),
                gap: 5,
              }}
              onPress={() => setShowCalendarModal(true)}>
              <EvilIcons
                name={'calendar'}
                size={responsiveFontSize(3)}
                color={AppColors.BLACK}
              />
              <AppText
                textAlignment={'center'}
                title="Pick a Date"
                textSize={1.7}
                textColor={AppColors.BLACK}
                textFontWeight
              />
            </TouchableOpacity>
          </View>
          {selectedDate.date ? (
            <View>
              <AppText
                mrgnTop={2}
                title="Select Time"
                textSize={2.5}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={{
                  backgroundColor: AppColors.WHITE,
                  elevation: 6,
                  borderRadius: 10,
                  marginTop: responsiveHeight(2),
                  alignItems: 'center',
                  // paddingHorizontal: responsiveWidth(3.4),
                  paddingVertical: 10,
                  width: responsiveWidth(16),
                  height: responsiveHeight(9.5),
                  gap: 5,
                }}
              >
                <EvilIcons
                  name={'calendar'}
                  size={responsiveFontSize(3)}
                  color={AppColors.BLACK}
                />
                <AppText
                  textAlignment={'center'}
                  title="Pick a Time"
                  textSize={1.7}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />
              </TouchableOpacity>
              {selectedTime && (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: AppColors.WHITE,
                      elevation: 5,
                      borderRadius: 10,
                      paddingHorizontal: responsiveWidth(3.4),
                      paddingVertical: 10,
                      flexDirection: 'row',
                      marginTop: responsiveHeight(2),
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 2,
                      borderColor: AppColors.BLUE,
                    }}
                  >
                    <AppText
                      title={moment(selectedTime).format('hh:mm A')}
                      textSize={2}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                  </TouchableOpacity>

                </View>
              )}
            </View>
          ) : null}



        </View>
      )}
      <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: responsiveHeight(2) }}>
        <AppButton width={90} bgColor={technicianDetails._id ? AppColors.BTNCOLOURS : '#CCCCCC'} disabled={technicianDetails._id ? false : true} handlePress={handleNavigation} title={'Next'} />
      </View>

      <CalendarModal
        visible={showCalendarModal}
        setVisible={() => setShowCalendarModal(false)}
        selected={selectedDateFromCalendar}
        setSelected={handleDateSelection}
      />
      {showPicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          minimumDate={new Date()} // Optional: disable past dates
        />
      )}
    </SafeAreaView>
  );
};

export default SelectAnyTech;
