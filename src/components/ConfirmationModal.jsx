/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Modal, ActivityIndicator} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import LineBreak from './LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from './AppButton';
import {useNavigation} from '@react-navigation/native';

const ConfirmationModal = ({iconName, title, subTitle, buttonOneTitle, buttonTwoTitle, isChangeColor, visible, setVisible}) => {
  const navigation = useNavigation();

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
          <View
            style={{
              backgroundColor: AppColors.BTNCOLOURS,
              padding: 10,
              borderRadius: 100,
            }}>
            <AntDesign
              name={iconName}
              size={responsiveFontSize(5)}
              color={AppColors.WHITE}
            />
          </View>

          <LineBreak space={2} />

          <AppText
            title={title}
            textSize={2.5}
            textColor={AppColors.BLACK}
            textFontWeight
            textAlignment={'center'}
          />

          <LineBreak space={1} />

          <AppText
            title={subTitle}
            textSize={2}
            textColor={AppColors.DARKGRAY}
            textAlignment={'center'}
          />

          <LineBreak space={2} />

          <View style={{width: '100%'}}>
            <AppButton
              title={buttonOneTitle}
              handlePress={setVisible}
              //   bgColor={AppColors.DARKGRAY}
              //   textColor={AppColors.WHITE}
            />

            <LineBreak space={2} />

            <AppButton
              title={buttonTwoTitle}
              handlePress={setVisible}
                bgColor={AppColors.WHITE}
                textColor={isChangeColor ? AppColors.BTNCOLOURS : AppColors.BLUE}
                borderWidth={2}
                borderColor={isChangeColor ? AppColors.BTNCOLOURS : AppColors.BLUE}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
