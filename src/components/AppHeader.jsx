/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
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
  pTop = 2,
}) => {
  console.log('sifvrt', isFvrt);
  const sideSlotSize = responsiveHeight(5.8);
  const renderBackButton = extraStyle => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{top: 12, right: 16, bottom: 12, left: 16}}
      style={[
        {
          minHeight: responsiveHeight(5),
          minWidth: responsiveHeight(5),
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 2,
        },
        extraStyle,
      ]}>
      <MaterialIcons
        name={'arrow-back-ios'}
        size={responsiveFontSize(2.7)}
        color={'red'}
      />
    </TouchableOpacity>
  );

  const renderRightAction = () => {
    if (title && !showHeartIcon) {
      return <View />;
    }

    if (isFvrtLoading) {
      return (
        <View
          style={{
            width: sideSlotSize,
            height: sideSlotSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={30} color={AppColors.BTNCOLOURS} />
        </View>
      );
    }

    if (showHeartIcon) {
      return (
        <TouchableOpacity
          onPress={handleFavouritePress}
          style={{
            width: sideSlotSize,
            height: sideSlotSize,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#F5F5F5',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name={isFvrt ? 'heart' : 'heart-outline'}
            size={responsiveFontSize(2.7)}
            color={isFvrt ? AppColors.BTNCOLOURS : AppColors.BLACK}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: AppColors.WHITE,
          gap: title ? 10 : 0,
          paddingTop:
            Platform.OS === 'ios' && title
              ? responsiveHeight(pTop)
              : title
              ? responsiveHeight(3)
              : 10,
          paddingBottom: title ? responsiveHeight(3) : 10,
          justifyContent:
            title && !isTextAlignCentered ? 'flex-start' : 'space-between',
          alignItems: 'center',
          // paddingVertical: responsiveHeight(2),
          paddingHorizontal: responsiveHeight(2),
        },
        style,
      ]}>
      {isTextAlignCentered ? (
        <>
          {renderBackButton({
            width: sideSlotSize,
            minWidth: sideSlotSize,
          })}
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText
              textColor={'red'}
              title={title}
              textSize={2.3}
              textFontWeight
              numberOfLines={1}
              styles={{textAlign: 'center', marginLeft: 0}}
            />
          </View>
          <View
            style={{
              width: sideSlotSize,
              minWidth: sideSlotSize,
              alignItems: 'flex-end',
            }}>
            {renderRightAction()}
          </View>
        </>
      ) : (
        <>
          {renderBackButton()}
          <AppText
            mrgnLeft={giveGap ? 3.5 : 0.1}
            textColor={'red'}
            title={title}
            textSize={2.3}
            textFontWeight
          />
          {renderRightAction()}
        </>
      )}
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
