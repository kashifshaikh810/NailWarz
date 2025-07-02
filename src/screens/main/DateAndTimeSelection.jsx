/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppButton from '../../components/AppButton';
import CalendarModal from '../../components/CalendarModal';
import {getTechnicianById} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';

// const datesData = [
//   {id: 1, day: 'TUE', date: 'Sep 9', mins: '30 mins'},
//   {id: 2, day: 'WED', date: 'Sep 10', mins: '30 mins'},
//   {id: 3, day: 'THU', date: 'Sep 11', mins: '30 mins'},
// ];

// const timesData = [
//   {id: 1, time: '9:00 AM', offText: '20% Off'},
//   {id: 2, time: '9:30 AM', offText: '20% Off'},
//   {id: 3, time: '10:30 AM', offText: ''},
//   {id: 4, time: '11:00 AM', offText: ''},
//   {id: 5, time: '11:30 AM', offText: ''},
//   {id: 6, time: '12:00 PM', offText: ''},
//   {id: 7, time: '12:30 PM', offText: ''},
// ];

const DateAndTimeSelection = ({route}) => {
  const navigation = useNavigation();
  const {data} = route?.params;
  const [isSelectedDate, setIsSelectedDate] = useState({id: 0});
  const [selectedDay, setSelectedDay] = useState();
  const [isSelectedTime, setIsSelectedTime] = useState({id: 0});
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [workingDays, setWorkingDays] = useState([]);
  const [timesData, setTimesData] = useState([]);
  console.log('selectedDay', selectedDay);
  // technicianId,saloonId,serviceId,technicianName,price,serviceName,
  useEffect(() => {
    if (selectedDay && workingDays.length > 0) {
      const dayData = workingDays.find(
        item => item.day === selectedDay && item.isActive,
      );

      if (dayData) {
        const slots = generateTimeSlots(dayData.startTime, dayData.endTime);
        setTimesData(slots);
      } else {
        setTimesData([]); // no working hours found
      }
    }
  }, [selectedDay, workingDays]);

  useEffect(() => {
    if (selectedDateFromCalendar && selectedFormattedDate) {
      const isCustom = !isCustomDateAlreadyInList;

      setIsSelectedDate(selectedFormattedDate);
      setSelectedDay(selectedFormattedDate.day);
    }
  }, [selectedDateFromCalendar]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    let id = 1;
    while (start <= end) {
      const formattedTime = new Date(start).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      slots.push({id: id++, time: formattedTime, offText: ''});
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };
  const getNextDates = (numDays = 3) => {
    const options = {month: 'short', day: 'numeric'};
    const dayLabels = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const shortLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return Array.from({length: numDays}, (_, i) => {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + i);
      const dayIndex = dateObj.getDay();

      // Format as dd-mm-yyyy
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      return {
        id: i + 1,
        day: dayLabels[dayIndex],
        label: shortLabels[dayIndex],
        date: dateObj.toLocaleDateString('en-US', options),
        formattedDate: formattedDate,
        mins: '30 mins',
      };
    });
  };
  const getTechnicianHandler = async () => {
    const response = await getTechnicianById(data?.selectedTechnician);
    setWorkingDays(response.data.workingDays);
  };
  useEffect(() => {
    getTechnicianHandler();
  }, []);

  const convertSelectedDate = (selectedDateStr, id = 1) => {
    const dateObj = new Date(selectedDateStr);
    const dayLabels = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const shortLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayIndex = dateObj.getDay();
    const options = {month: 'short', day: 'numeric'};

    // Format as dd-mm-yyyy
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return {
      id: id,
      day: dayLabels[dayIndex],
      label: shortLabels[dayIndex],
      date: dateObj.toLocaleDateString('en-US', options), // for UI
      formattedDate: formattedDate, // for API
      mins: '30 mins',
    };
  };

  const baseDates = getNextDates();

  const maxId = Math.max(...baseDates.map(item => item.id), 0);
  const selectedFormattedDate = convertSelectedDate(
    selectedDateFromCalendar,
    maxId + 1,
  );

  const isCustomDateAlreadyInList = baseDates.some(
    item => item.date === selectedFormattedDate.date,
  );

  const datesData =
    selectedDateFromCalendar && !isCustomDateAlreadyInList
      ? [...baseDates, selectedFormattedDate]
      : baseDates;
  console.log('isSelectedTime', isSelectedTime);
  // console.log('formattedTime', formattedTime);

  return (
    <ScrollView style={{flexGrow: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader onPress={() => navigation.goBack()} title="Date and time" />

      <View
        style={{
          paddingHorizontal: responsiveWidth(4),
          marginVertical: responsiveHeight(2),
          flex: 1,
        }}>
        <AppText
          title="Select Date"
          textSize={2.5}
          textColor={AppColors.BLACK}
          textFontWeight
        />

        <LineBreak space={1.5} />

        <FlatList
          data={datesData}
          horizontal
          ListFooterComponent={
            <TouchableOpacity
              style={{
                backgroundColor: AppColors.WHITE,
                borderRadius: 10,
                alignItems: 'center',
                paddingHorizontal: responsiveWidth(3.4),
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
                title="More Dates"
                textSize={1.7}
                textColor={AppColors.BLACK}
                textFontWeight
              />
            </TouchableOpacity>
          }
          contentContainerStyle={{gap: 15}}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setIsSelectedDate(item);
                  setSelectedDay(item?.day);

                  console.log('item========', item);
                }}
                style={{
                  backgroundColor: AppColors.WHITE,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingHorizontal: responsiveWidth(3.4),
                  paddingVertical: 10,
                  borderWidth: isSelectedDate.id === item.id ? 2 : 0,
                  borderColor: AppColors.BLUE,
                }}>
                <AppText
                  title={item.label}
                  textSize={1.7}
                  textColor={
                    isSelectedDate.id === item.id
                      ? AppColors.BLUE
                      : AppColors.DARKGRAY
                  }
                  textFontWeight
                />
                <LineBreak space={0.3} />

                <AppText
                  title={item.date}
                  textSize={1.5}
                  textColor={
                    isSelectedDate.id === item.id
                      ? AppColors.BLUE
                      : AppColors.BLACK
                  }
                  textFontWeight
                />
                <LineBreak space={0.3} />

                <AppText
                  title={item.mins}
                  textSize={1.3}
                  textColor={
                    isSelectedDate.id === item.id
                      ? AppColors.BLUE
                      : AppColors.DARKGRAY
                  }
                />
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={3} />

        {timesData?.length > 0 ? (
          <View>
            <AppText
              title="Select Time"
              textSize={2.5}
              textColor={AppColors.BLACK}
              textFontWeight
            />

            <LineBreak space={1.5} />

            <FlatList
              data={timesData}
              contentContainerStyle={{gap: 15}}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: AppColors.WHITE,
                    borderRadius: 10,
                    paddingHorizontal: responsiveWidth(3.4),
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: isSelectedTime.id === item.id ? 2 : 0,
                    borderColor: AppColors.BLUE,
                  }}
                  onPress={() =>
                    setIsSelectedTime({id: item.id, value: item?.time})
                  }>
                  <AppText
                    title={item.time}
                    textSize={2}
                    textColor={AppColors.BLACK}
                    textFontWeight
                  />
                  {item.offText && (
                    <AppText
                      title={item.offText}
                      textSize={1.7}
                      textColor={AppColors.GREEN}
                      textFontWeight
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            <LineBreak space={4} />
            <AppButton
              title="Confirm Appointment"
              handlePress={() =>
                isSelectedTime.id !== 0
                  ? navigation.navigate('BookingSummary', {
                      data: {
                        ...data,
                        selectedTime: isSelectedTime,
                        selectedDate: isSelectedDate?.date,
                        selectedDay: isSelectedDate?.day,
                        selectedBookingDate: isSelectedDate?.formattedDate,
                      },
                    })
                  : ShowToast('error', 'Plz Select Appointment Time To Proceed')
              }
              // bgColor={AppColors.DARKGRAY}
              // textColor={AppColors.WHITE}
            />
          </View>
        ) : (
          <View
            style={{marginTop: responsiveHeight(5), justifyContent: 'center'}}>
            <AppText
              title={
                selectedDay
                  ? 'Salon is closed on this day. Choose another date.'
                  : null
              }
              textSize={2.5}
              textAlignment={'center'}
              textColor={AppColors.BLACK}
              textFontWeight
            />
          </View>
        )}
        <CalendarModal
          visible={showCalendarModal}
          setVisible={() => setShowCalendarModal(false)}
          selected={selectedDateFromCalendar}
          setSelected={setSelectedDateFromCalendar}
        />
      </View>
    </ScrollView>
  );
};

export default DateAndTimeSelection;
