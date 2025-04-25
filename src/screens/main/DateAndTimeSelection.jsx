/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
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
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AppButton from '../../components/AppButton';

const datesData = [
  {id: 1, day: 'TUE', date: 'Sep 9', mins: '40 mins'},
  {id: 2, day: 'WED', date: 'Sep 10', mins: '21 mins'},
  {id: 3, day: 'THU', date: 'Sep 11', mins: '45 mins'},
];

const timesData = [
  {id: 1, time: '9:00 AM', offText: '20% Off'},
  {id: 2, time: '9:30 AM', offText: '20% Off'},
  {id: 3, time: '10:30 AM', offText: ''},
  {id: 4, time: '11:00 AM', offText: ''},
  {id: 5, time: '11:30 AM', offText: ''},
  {id: 6, time: '12:00 PM', offText: ''},
  {id: 7, time: '12:30 PM', offText: ''},
];

const DateAndTimeSelection = () => {
  const navigation = useNavigation();
  const [isSelectedDate, setIsSelectedDate] = useState({id: 0})
  const [isSelectedTime, setIsSelectedTime] = useState({id: 0})

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader onPress={() => navigation.goBack()} title="Date and time" />

      <View
        style={{
          paddingHorizontal: responsiveWidth(4),
          marginVertical: responsiveHeight(2),
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
                }}>
                     <EvilIcons
                      name={"calendar"}
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
              onPress={() => setIsSelectedDate({id: item.id})}
                style={{
                  backgroundColor: AppColors.WHITE,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingHorizontal: responsiveWidth(3.4),
                  paddingVertical: 10,
                  borderWidth: isSelectedDate.id === item.id ? 2 : 0,
                  borderColor: AppColors.BLUE
                }}>
                <AppText
                  title={item.day}
                  textSize={1.7}
                  textColor={isSelectedDate.id === item.id ? AppColors.BLUE : AppColors.DARKGRAY}
                  textFontWeight
                />
                <LineBreak space={0.3} />

                <AppText
                  title={item.date}
                  textSize={1.5}
                  textColor={isSelectedDate.id === item.id ? AppColors.BLUE : AppColors.BLACK}
                  textFontWeight
                />
                <LineBreak space={0.3} />

                <AppText
                  title={item.mins}
                  textSize={1.3}
                  textColor={isSelectedDate.id === item.id ? AppColors.BLUE : AppColors.DARKGRAY}
                />
              </TouchableOpacity>
            );
          }}
        />

<LineBreak space={3} />

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
          renderItem={({item}) => {
            return (
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
                  borderColor: AppColors.BLUE
                }}
              onPress={() => setIsSelectedTime({id: item.id})}
                >
                <AppText
                  title={item.time}
                  textSize={2}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />

             {item.offText && <AppText
                  title={item.offText}
                  textSize={1.7}
                  textColor={AppColors.GREEN}
                  textFontWeight
                />}
              </TouchableOpacity>
            );
          }}
        />

<LineBreak space={4} />

        <AppButton
          title="Confirm Appointment"
          handlePress={() => navigation.navigate('BookingSummary')}
          // bgColor={AppColors.DARKGRAY}
          // textColor={AppColors.WHITE}
        />
      </View>
    </ScrollView>
  );
};

export default DateAndTimeSelection;
