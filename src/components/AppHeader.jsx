/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AppText from './AppTextComps/AppText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppButton from './AppButton';
import APPImages from '../assets/APPImages';

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
  showHeartIcon,
  giveGap = false,
  isLogo = false,
}) => {
  console.log('sifvrt', isFvrt);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: AppColors.WHITE,
          gap: title ? 10 : 0,
          paddingTop: title ? responsiveHeight(3) : 10,
          paddingBottom: title ? responsiveHeight(3) : 10,
          justifyContent:
            title && !isTextAlignCentered ? 'flex-start' : 'space-between',
          alignItems: 'center',
          // paddingVertical: responsiveHeight(2),
          paddingHorizontal: responsiveHeight(2),
        },
        style,
      ]}>
      <TouchableOpacity onPress={onPress}>
        <MaterialIcons
          name={'arrow-back-ios'}
          size={responsiveFontSize(2.7)}
          color={'red'}
        />
      </TouchableOpacity>
      <AppText
        mrgnLeft={giveGap ? 3.5 : 1}
        textColor={'red'}
        title={title}
        textSize={2.3}
        textFontWeight
      />
      {title && !showHeartIcon ? (
        <View />
      ) : isFvrtLoading ? (
        <ActivityIndicator size={30} color={AppColors.BTNCOLOURS} />
      ) : showHeartIcon ? (
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
      ) : null}
      {isBtn ? (
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <AppButton handlePress={handleBtnPress} width={25} title="Post" />
        </View>
      ) : null}
      {isLogo && (
        <View style={{flex: responsiveHeight(0.06), alignItems: 'center'}}>
          <Image
            source={APPImages.logoSmall}
            style={{
              // alignSelf: 'center',
              height: responsiveHeight(8),
              width: responsiveWidth(15),
            }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default AppHeader;
