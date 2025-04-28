/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Modal} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import AppText from './AppTextComps/AppText';
import AppButton from './AppButton';

const RemoveFavouritesModal = ({visible, handleCancelButtonPress, handleAppointmentButtonPress}) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
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
            height: responsiveHeight(38),
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

          <View style={{paddingHorizontal: responsiveWidth(4)}}>
            <AppText
              title="Remove from Favorites"
              textColor={AppColors.BLACK}
              textSize={2.5}
              textFontWeight
              textAlignment={'center'}
            />

            <LineBreak space={2} />

            <AppText
              title="Are you sure you want to remove this?"
              textColor={AppColors.BLACK}
              textSize={2.2}
              textFontWeight
            />

            <LineBreak space={1} />

            <AppText
              title="Removing this salon will delete it from your saved favorites list."
              textColor={AppColors.BLACK}
              textSize={1.7}
            />

            <LineBreak space={2} />

            <AppButton
              title={`Yes, Remove Salon`}
              handlePress={handleCancelButtonPress}
              bgColor={AppColors.WHITE}
              textColor={AppColors.BTNCOLOURS}
              borderColor={AppColors.BTNCOLOURS}
              borderWidth={2}
            />

            <LineBreak space={1} />

            <AppButton
              title={`Keep in Favorites`}
              handlePress={handleAppointmentButtonPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveFavouritesModal;
