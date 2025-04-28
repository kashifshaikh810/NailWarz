/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';

type props = {
  title?: any;
  bgColor?: any;
  textColor?: any;
  handlePress?: () => void;
  borderWidth?: any,
  borderColor?: any,
};
const AppButton = ({title, handlePress, bgColor, textColor, borderWidth, borderColor}: props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        borderColor: borderColor ? borderColor : null,
        borderWidth: borderWidth ? borderWidth : 0,
      }}>
      <AppText
        textColor={textColor ? textColor : AppColors.WHITE}
        textSize={2.4}
        title={title ? title : "Continue"}
        textFontWeight
      />
    </TouchableOpacity>
  );
};

export default AppButton;
