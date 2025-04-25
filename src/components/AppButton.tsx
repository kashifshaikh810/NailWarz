import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';

type props = {
  title?: any;
  bgColor?: any;
  textColor?: any;
  handlePress?: () => void;
};
const AppButton = ({title, handlePress, bgColor, textColor}: props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        backgroundColor: bgColor ? bgColor : AppColors.BTNCOLOURS,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
      }}>
      <AppText
        textColor={textColor ? textColor : AppColors.WHITE}
        textSize={2.5}
        title={title ? title : "Continue"}
        textFontWeight
      />
    </TouchableOpacity>
  );
};

export default AppButton;
