/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View,  Modal} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from './AppButton';

const BookingCanceledModal = ({visible, handlePress}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            width: responsiveWidth(90),
          }}>
            <View style={{backgroundColor: AppColors.BTNCOLOURS, padding: 10, borderRadius: 100}}>
            <AntDesign
              name={'check'}
              size={responsiveFontSize(5)}
              color={AppColors.WHITE}
            />
            </View>

            <LineBreak space={2} />

          <AppText
            title={'Booking Canceled'}
            textSize={2.2}
            textColor={AppColors.BLACK}
            textFontWeight
            textAlignment={'center'}
          />

                    <LineBreak space={1} />

          <AppText
            title={'Your appointment has been successfully canceled.'}
            textSize={2}
            textColor={AppColors.DARKGRAY}
            textAlignment={'center'}
          />

          <LineBreak space={2} />

          <View style={{width: '100%'}}>
          <AppButton
              title={'Back to Bookings'}
              handlePress={handlePress}
              //   bgColor={AppColors.DARKGRAY}
              //   textColor={AppColors.WHITE}
            />
        </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookingCanceledModal;
