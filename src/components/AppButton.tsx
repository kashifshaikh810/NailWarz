/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';

type props = {
  title?: any;
  bgColor?: any;
  textColor?: any;
  handlePress?: () => void;
  borderWidth?: any,
  borderColor?: any,
  width?: number,
  marginHorizontal?: number,
  disabled?: boolean,
  style?: any,
  txtSize?: number,
};
const AppButton = ({ title, style, txtSize = 2.2, disabled, width, marginHorizontal, handlePress, bgColor, textColor, borderWidth, borderColor }: props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePress}
      style={[{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: responsiveHeight(marginHorizontal),
        padding: 10,
        borderRadius: 10,
        borderColor: borderColor ? borderColor : null,
        borderWidth: borderWidth ? borderWidth : 0,
        width: responsiveWidth(width),
      }, style]}>
      <AppText
        textColor={textColor ? textColor : AppColors.WHITE}
        textSize={txtSize}
        title={title ? title : "Continue"}
        textFontWeight
      />
    </TouchableOpacity>
  );
};

export default AppButton;
