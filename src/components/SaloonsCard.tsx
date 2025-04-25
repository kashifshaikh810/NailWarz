/* eslint-disable react-native/no-inline-styles */
import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
type props = {
  img?: any;
  title?: string;
  location?: string;
  KM?: string;
  Rating?: number;
  TotalNoOfRating?: number;
};

const SaloonsCard = ({
  KM,
  Rating,
  TotalNoOfRating,
  img,
  location,
  title,
}: props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('HomeDetails')}>
      <View
        style={{
          padding: 20,
          borderRadius: 10,
          width: responsiveWidth(90),
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: AppColors.WHITE,
        }}>
        <Image
          source={img}
          style={{
            height: responsiveHeight(10),
            width: responsiveHeight(10),
            resizeMode: 'contain',
            borderRadius: 10,
            marginRight: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: responsiveWidth(60),
          }}>
          <View style={{gap: 5}}>
            <AppText
              title={title}
              textColor={AppColors.BLACK}
              textSize={2.5}
              textFontWeight
            />
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Ionicons
                name={'location-outline'}
                size={responsiveFontSize(2)}
                color={AppColors.DARKGRAY}
              />
              <AppText
                title={location}
                textSize={2}
                textColor={AppColors.DARKGRAY}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Entypo
                name={'star'}
                size={responsiveFontSize(2.5)}
                color={'#FFD33C'}
              />
              <AppText title={Rating} textSize={2} textFontWeight />
              <AppText
                title={`(${TotalNoOfRating})`}
                textSize={1.5}
                textColor={AppColors.DARKGRAY}
              />
            </View>
          </View>
          <AppText title={`${KM} KM`} textColor={AppColors.DARKGRAY} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SaloonsCard;
