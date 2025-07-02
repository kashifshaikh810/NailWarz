/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import AppText from './AppTextComps/AppText';
import AppButton from './AppButton';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
const RemoveFavouritesModal = ({
  visible,
  handleCancelButtonPress,
  handleAppointmentButtonPress,
  handleBackdropPress,
  loading2,
}) => {
  return (
    <View style={{position: 'absolute'}}>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={{
          margin: 0,
        }}
        backdropOpacity={0.1}
        backdropColor="white"
        onBackdropPress={handleBackdropPress}
        isVisible={visible}>
        <View
          style={{
            flex: 1,
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
                title={
                  loading2 ? (
                    <ActivityIndicator
                      size={'large'}
                      color={AppColors.BTNCOLOURS}
                    />
                  ) : (
                    'Yes, Remove Salon'
                  )
                }
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
    </View>
  );
};

export default RemoveFavouritesModal;
