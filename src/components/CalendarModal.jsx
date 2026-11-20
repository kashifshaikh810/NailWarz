/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Modal, Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import {CalendarList} from 'react-native-calendars';

const getTodayLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const CalendarModal = ({selected, setSelected, visible, setVisible}) => {
  const todayDateString = getTodayLocalDateString();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={setVisible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={setVisible}
          style={{
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        />
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            width: responsiveWidth(100),
            height: responsiveHeight(50),
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: responsiveHeight(6),
            }}>
            <View
              style={{
                backgroundColor: AppColors.LIGHTGRAY,
                width: responsiveWidth(15),
                height: responsiveHeight(0.7),
                borderRadius: 100,
              }}
            />
            <Pressable
              hitSlop={12}
              onPress={setVisible}
              style={({pressed}) => ({
                position: 'absolute',
                top: responsiveHeight(1),
                right: responsiveWidth(4),
                width: responsiveHeight(4.8),
                height: responsiveHeight(4.8),
                borderRadius: responsiveHeight(2.4),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: AppColors.WHITE2,
                opacity: pressed ? 0.65 : 1,
              })}>
              <Feather
                name="x"
                size={responsiveFontSize(2.4)}
                color={AppColors.BLACK}
              />
            </Pressable>
          </View>

          <CalendarList
            minDate={todayDateString}
            onDayPress={day => {
              setSelected(day.dateString);
              setVisible();
            }}
            pastScrollRange={0}
            futureScrollRange={12}
            scrollEnabled={true}
            showScrollIndicator={true}
            nestedScrollEnabled={true}
            removeClippedSubviews={false}
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
