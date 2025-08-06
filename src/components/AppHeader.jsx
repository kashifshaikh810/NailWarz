/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import AppText from './AppTextComps/AppText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppButton from './AppButton';

const AppHeader = ({
  onPress,
  handleBtnPress,
  handleFavouritePress,
  isFvrtLoading,
  isFvrt,
  isBtn = false,
  title,
  isTextAlignCentered,
  style,
}) => {
  console.log('sifvrt',isFvrt)
  return (
    <View
      style={[{
        flexDirection: 'row',
        backgroundColor: AppColors.WHITE,
        gap: title ? 10 : 0,
        paddingTop: title ? responsiveHeight(3) : 10,
        paddingBottom: title ? responsiveHeight(3) : 10,
        justifyContent:
          title && !isTextAlignCentered ? 'flex-start' : 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(2),
      },style]}>
      <TouchableOpacity onPress={onPress}>
        <MaterialIcons
          name={'arrow-back-ios'}
          size={responsiveFontSize(2.7)}
          color={AppColors.BLACK}
        />
      </TouchableOpacity>
      <AppText title={title} textSize={2.4} textFontWeight />
      {title ? (
        <View />
      ) : isFvrtLoading ? (
        <ActivityIndicator size={30} color={AppColors.BTNCOLOURS} />
      ) : (
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={{
            borderWidth: 1,
            padding: responsiveHeight(1.5),
            borderRadius: 10,
            borderColor: '#F5F5F5',
          }}>
          <Ionicons
            name={isFvrt ? 'heart' : 'heart-outline'}
            size={responsiveFontSize(2.7)}
            color={isFvrt ? AppColors.BTNCOLOURS : AppColors.BLACK}
          />
        </TouchableOpacity>
      )}
      {isBtn ? (
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <AppButton handlePress={handleBtnPress} width={25} title="Post" />
        </View>
      ) : null}
    </View>
  );
};

export default AppHeader;
