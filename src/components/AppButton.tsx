/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';

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
  isLoading?: boolean,
};
const AppButton = ({
  title,
  style,
  txtSize = 2.2,
  disabled,
  width,
  marginHorizontal,
  handlePress,
  bgColor,
  textColor,
  borderWidth,
  borderColor,
  isLoading,
}: props) => {
  const isDisabled = disabled || isLoading;
  const buttonTextColor = textColor ? textColor : AppColors.WHITE;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={handlePress}
      style={[{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: responsiveHeight(marginHorizontal),
        padding: 10,
        minHeight: responsiveHeight(6.2),
        borderRadius: 10,
        borderColor: borderColor ? borderColor : null,
        borderWidth: borderWidth ? borderWidth : 0,
        width: responsiveWidth(width),
        opacity: isDisabled ? 0.8 : 1,
      }, style]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonTextColor} />
      ) : React.isValidElement(title) ? (
        title
      ) : (
        <AppText
          textColor={buttonTextColor}
          textSize={txtSize}
          title={title ? title : 'Continue'}
          textFontWeight
        />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
