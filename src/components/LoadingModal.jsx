/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View,  Modal, ActivityIndicator} from 'react-native';
import {
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';

const LoadingModal = () => {
  return (
    <Modal transparent={true} animationType="fade" visible={true}>
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
              <ActivityIndicator color={AppColors.WHITE} size={45} />
            </View>

            <LineBreak space={2} />

          <AppText
            title={'Processing Your Payment...'}
            textSize={2.2}
            textColor={AppColors.BLACK}
            textFontWeight
            textAlignment={'center'}
          />

                    <LineBreak space={1} />

          <AppText
            title={'Please wait while we complete your transaction.'}
            textSize={2}
            textColor={AppColors.DARKGRAY}
            textAlignment={'center'}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
