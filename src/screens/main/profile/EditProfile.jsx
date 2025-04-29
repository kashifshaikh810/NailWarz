/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import APPImages from '../../../assets/APPImages';
import Feather from 'react-native-vector-icons/Feather';
import LineBreak from '../../../components/LineBreak';
import AppTextInput from '../../../components/AppTextInput';

const EditProfile = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title="Edit Profile" />

      <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              borderWidth: 2,
              width: 110,
              height: 110,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Image
              source={APPImages.nailsTwo}
              style={{width: 100, height: 100, borderRadius: 100}}
            />
            <View style={{position: 'absolute', bottom: 0, right: 0}}>
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.BLACK,
                  padding: 8,
                  borderRadius: 100,
                }}
                activeOpacity={0.7}>
                <Feather
                  name={'camera'}
                  size={responsiveFontSize(1.6)}
                  color={AppColors.WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>

          <LineBreak space={7} />

          <View>
            <AppTextInput
              inputPlaceHolder={'Charles James'}
              containerBg={AppColors.INPUTBG}
            />
            <LineBreak space={2} />

            <AppTextInput
              inputPlaceHolder={'charlesjames988@gmail.com'}
              containerBg={AppColors.INPUTBG}
            />

            <LineBreak space={2} />

            <AppTextInput
              inputPlaceHolder={'+123 456 7890'}
              containerBg={AppColors.INPUTBG}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;
