/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {View, Modal} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import {Calendar, LocaleConfig, CalendarList} from 'react-native-calendars';

const CalendarModal = ({selected, setSelected, visible, setVisible}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            width: responsiveWidth(100),
            height: responsiveHeight(50),
          }}>
          <LineBreak space={1} />
          <View
            style={{
              backgroundColor: AppColors.LIGHTGRAY,
              width: responsiveWidth(15),
              height: responsiveHeight(0.7),
              borderRadius: 100,
              alignSelf: 'center',
            }}
          />

          <LineBreak space={2} />

          <CalendarList
        onDayPress={(day) => {
          setSelected(day.dateString);
          setVisible()
        }}
        pastScrollRange={12}   // months before current
        futureScrollRange={12} // months after current
        scrollEnabled={true}
        showScrollIndicator={true}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#00adf5',
            selectedTextColor: '#fff',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
        }}
      />
         
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;
