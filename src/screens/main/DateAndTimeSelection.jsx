/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
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
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppButton from '../../components/AppButton';
import CalendarModal from '../../components/CalendarModal';
import {getTechnicianById} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';
import moment from 'moment';

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
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log('selectedDay===>>><<<<', selectedDay);
  console.log('bookedAppointments===>>><<<<', bookedAppointments);
  console.log('data===>>><<<<', data);
  console.log('isSelectedTime.id !== 0===>>><<<<', isSelectedTime.id === 0);
  useEffect(() => {
    if (selectedDay && workingDays?.length > 0) {
      const dayData = workingDays?.find(
        item => item.day === selectedDay && item.isActive,
      );

      if (dayData) {
        let slots = generateTimeSlots(
          dayData.startTime,
          dayData.endTime,
          dayData.breakStart,
          dayData.breakEnd,
        );
        console.log('Slot Time:', slots);

        const bookedTimes = bookedAppointments?.map(
          // appointment => appointment.time,
          appointment => moment(appointment.time, 'hh:mm A').format('HH:mm'),
        ); // raw HH:mm

        if (bookedTimes?.length > 0) {
          slots = slots.filter(slot => !bookedTimes.includes(slot.raw)); // compare raw times
        }
        console.log('bookedTimes (formatted) ===>>>', bookedTimes);

        setTimesData(slots);
      } else {
        setTimesData([]);
      }
    }
  }, [selectedDay, workingDays, bookedAppointments, isSelectedDate]);

  useEffect(() => {
    if (datesData?.length > 0 && !isSelectedDate?.id) {
      const firstItem = datesData[0];
      setIsSelectedDate(firstItem);
      setSelectedDay(firstItem.day);
    }
  }, [datesData]);
  useEffect(() => {
    if (selectedDateFromCalendar && selectedFormattedDate) {
      setIsSelectedDate(selectedFormattedDate);
      setSelectedDay(selectedFormattedDate.day);
    }
  }, [selectedDateFromCalendar]);

  // const generateTimeSlots = (startTime, endTime) => {
  //   const slots = [];
  //   let [startHour, startMinute] = startTime.split(':').map(Number);
  //   let [endHour, endMinute] = endTime.split(':').map(Number);

  //   const start = new Date();
  //   start.setHours(startHour, startMinute, 0, 0);

  //   const end = new Date();
  //   end.setHours(endHour, endMinute, 0, 0);

  //   let id = 1;
  //   while (start <= end) {
  //     const formattedTime = new Date(start).toLocaleTimeString([], {
  //       hour: 'numeric',
  //       minute: '2-digit',
  //       hour12: true,
  //     });

  //     slots.push({id: id++, time: formattedTime, offText: ''});
  //     start.setMinutes(start.getMinutes() + 30);
  //   }

  //   return slots;
  // };
  const generateTimeSlots = (startTime, endTime, breakStart, breakEnd) => {
    const slots = [];

    const parse12HourTime = timeStr => moment(timeStr, 'hh:mm A').toDate();

    const formatToRaw = date => moment(date).format('HH:mm'); // Internal comparison
    const formatToDisplay = date => moment(date).format('hh:mm A'); // For UI

    const start = parse12HourTime(startTime);
    const end = parse12HourTime(endTime);
    const breakStartTime = breakStart ? parse12HourTime(breakStart) : null;
    const breakEndTime = breakEnd ? parse12HourTime(breakEnd) : null;

    let id = 1;
    const current = new Date(start);

    while (current < end) {
      const currentRaw = formatToRaw(current);
      const currentDisplay = formatToDisplay(current);

      const isInBreak =
        breakStartTime &&
        breakEndTime &&
        current >= breakStartTime &&
        current < breakEndTime;

      if (!isInBreak) {
        slots.push({
          id: id++,
          time: currentDisplay,
          raw: currentRaw,
          offText: '',
        });
      }

      current.setMinutes(current.getMinutes() + 30); // 30 min gap
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
    setIsLoading(true);
    const response = await getTechnicianById(
      data?.selectedTechnician,
      isSelectedDate?.formattedDate,
    );
    setIsLoading(false);

    console.log('response.data======>>>><<<<<<<', response?.data);
    setWorkingDays(response.data?.technician?.workingDays);
    setBookedAppointments(response.data?.technicianAppointments);
  };
  useEffect(() => {
    getTechnicianHandler();
  }, [isSelectedDate?.formattedDate]);

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
    <View style={{flex: 1}}>
      <ScrollView style={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader onPress={() => navigation.goBack()} title="Date and time" />
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 0.5,
            elevation: 5,
            width: '100%',
          }}
        />
        <View
          style={{
            // paddingHorizontal: responsiveWidth(4),
            // backgroundColor:AppColors.WHITE,
            marginVertical: responsiveHeight(2),
            flex: 1,
          }}>
          <AppText
            mrgnLeft={2}
            title="Select Date"
            textSize={2.5}
            textColor={AppColors.BLACK}
            textFontWeight
          />

          {/* <LineBreak space={1.5} /> */}

          <FlatList
            data={datesData}
            showsHorizontalScrollIndicator={false}
            horizontal
            ListFooterComponent={
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.WHITE,
                  elevation: 6,
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
            contentContainerStyle={{gap: 15, padding: responsiveHeight(2)}}
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
                    elevation: 6,
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

          <LineBreak space={1.5} />

          {isLoading ? (
            <View
              style={{height: responsiveHeight(25), justifyContent: 'center'}}>
              <ActivityIndicator size={40} color={AppColors.BTNCOLOURS} />
            </View>
          ) : timesData?.length > 0 ? (
            <View>
              <AppText
                mrgnLeft={2}
                title="Select Time"
                textSize={2.5}
                textColor={AppColors.BLACK}
                textFontWeight
              />

              {/* <LineBreak space={1.5} /> */}

              <FlatList
                data={timesData}
                contentContainerStyle={{
                  gap: responsiveHeight(2),
                  padding: responsiveHeight(2),
                  paddingBottom: responsiveHeight(7),
                }}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: AppColors.WHITE,
                      elevation: 5,
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
              <LineBreak space={2} />
            </View>
          ) : (
            <View
              style={{
                marginTop: responsiveHeight(5),
                justifyContent: 'center',
              }}>
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
      {timesData?.length > 0 ? (
        <AppButton
          style={{
            marginHorizontal: responsiveHeight(2),
            position: 'absolute',
            bottom: responsiveHeight(2),
            width: responsiveWidth(90),
            alignSelf: 'center',
          }}
          bgColor={isSelectedTime.id === 0 ? '#CCCCCC' : AppColors.BTNCOLOURS}
          title="Confirm Appointment"
          disabled={isSelectedTime.id === 0}
          handlePress={() =>
            navigation.navigate('BookingSummary', {
              data: {
                ...data,
                selectedTime: isSelectedTime,
                selectedDate: isSelectedDate?.date,
                selectedDay: isSelectedDate?.day,
                selectedBookingDate: isSelectedDate?.formattedDate,
              },
            })
          }
          // bgColor={AppColors.DARKGRAY}
          // textColor={AppColors.WHITE}
        />
      ) : null}
    </View>
  );
};

export default DateAndTimeSelection;
