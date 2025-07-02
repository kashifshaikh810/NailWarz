/* eslint-disable react-native/no-inline-styles */
import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions'
import AppColors from '../utils/AppColors'
import Ionicons from 'react-native-vector-icons/Ionicons'
type props = {
  logo?: any,
  inputPlaceHolder?: any,
  inputBgColour?: any,
  inputWidth?: number,
  containerBg?: any,
  onChangeText?: () => void;
  fntSize?: number;
  multiline?: boolean;
  value?:string;
  height?:number;
  txtAlignVertical?:string;
}
const AppTextInput = ({ logo,txtAlignVertical, inputBgColour, multiline = false,value, fntSize, onChangeText, inputPlaceHolder, inputWidth = 80, containerBg,height }: props) => {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: containerBg, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, alignItems: 'center', gap: 10 }}>
      {
        logo
      }
      <TextInput
        textAlignVertical={txtAlignVertical ? txtAlignVertical : 'auto'}
        multiline={multiline}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="#A0A0A0"
        placeholder={inputPlaceHolder}
        style={{ width: responsiveWidth(inputWidth),height:responsiveHeight(height), color: AppColors.BLACK, fontSize: responsiveFontSize(fntSize) }}

      />
    </View>
  )
}

export default AppTextInput;
