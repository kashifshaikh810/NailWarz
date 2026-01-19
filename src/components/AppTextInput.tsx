/* eslint-disable react-native/no-inline-styles */
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from './AppTextComps/AppText';
type props = {
  logo?: any,
  inputPlaceHolder?: any,
  inputBgColour?: any,
  inputWidth?: number,
  containerBg?: any,
  onChangeText?: () => void;
  fntSize?: number;
  multiline?: boolean;
  value?: string;
  height?: number;
  txtAlignVertical?: string;
  keyboardType?: string;
  secureTxtEntry?: boolean;
  autoCapitalize?: string;
  handleEyePress?: () => void;
  showEye?: boolean;
  label?: string;
  containerWidth?: number;
}
const AppTextInput = ({ logo, label, containerWidth, handleEyePress, showEye = false, secureTxtEntry = false, txtAlignVertical, keyboardType, inputBgColour, multiline = false, value, fntSize, onChangeText, inputPlaceHolder, inputWidth = 80, containerBg, height, autoCapitalize }: props) => {
  return (
    <View style={{ gap: responsiveHeight(1.5), }}>
      {label && (
        <AppText textFontWeight textSize={1.8} title={label} />
      )}
      <View style={{
        flexDirection: 'row',
        width: responsiveWidth(containerWidth),
        backgroundColor: containerBg,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
        gap: 10,
      }}>
        {
          logo
        }
        <TextInput
          keyboardType={keyboardType}
          secureTextEntry={secureTxtEntry}
          autoCapitalize={autoCapitalize}
          textAlignVertical={txtAlignVertical || 'auto'}
          multiline={multiline}
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor="#A0A0A0"
          placeholder={inputPlaceHolder}
          scrollEnabled={true}
          style={{
            flex: 1,
            height: Platform.OS === 'ios' ? responsiveHeight(multiline ? 14 : 5) : responsiveHeight(height),
            color: AppColors.BLACK,
            fontSize: responsiveFontSize(fntSize),
          }}
        />
        {showEye && (
          <TouchableOpacity onPress={handleEyePress} style={{ position: 'absolute', right: 10 }}>
            <Ionicons name={secureTxtEntry ? 'eye-off' : 'eye'} size={25} color="#181818" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppTextInput;
