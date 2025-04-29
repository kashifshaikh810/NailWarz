/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import APPImages from '../../../assets/APPImages';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import SeeMoreText from '../../../components/SeeMoreText';
import {useNavigation} from '@react-navigation/native';

const Community = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: AppColors.BLACK}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: responsiveWidth(3),
          paddingVertical: responsiveHeight(3),
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <EvilIcons
            name={'close'}
            color={AppColors.WHITE}
            size={responsiveFontSize(3.5)}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Entypo
            name={'dots-three-horizontal'}
            color={AppColors.WHITE}
            size={responsiveFontSize(3)}
          />
        </TouchableOpacity>
      </View>

      <LineBreak space={20} />

      <Image
        source={APPImages.nailsTwo}
        style={{width: responsiveWidth(100), height: responsiveHeight(45)}}
      />

      <View
        style={{
          paddingHorizontal: responsiveWidth(3),
          paddingVertical: responsiveHeight(2),
        }}>
        <SeeMoreText
          text={
            'Lorem ipsum simply dummy amet, consectetur sadipscing elitr, sed...'
          }
          textColor={AppColors.WHITE}
          textSize={1.8}
        />

        <LineBreak space={2} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText
            title={`${101} Likes`}
            textColor={AppColors.WHITE}
            textSize={1.5}
          />
          <View style={{flexDirection: 'row', gap: 15}}>
            <AppText
              title={`${32} Comments`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
            <AppText
              title={`${19} Shares`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
          </View>
        </View>

        <LineBreak space={5} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(7),
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
            <AntDesign
              name={'like2'}
              color={AppColors.WHITE}
              size={responsiveFontSize(2)}
            />
            <AppText
              title={`Like`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
            <MaterialCommunityIcons
              name={'comment-text-multiple-outline'}
              color={AppColors.WHITE}
              size={responsiveFontSize(2)}
            />
            <AppText
              title={`Comment`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
            <Fontisto
              name={'share-a'}
              color={AppColors.WHITE}
              size={responsiveFontSize(2)}
            />
            <AppText
              title={`Share`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Community;
