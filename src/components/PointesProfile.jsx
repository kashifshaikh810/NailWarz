/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';

const PointesProfile = ({item}) => {
  return (
    <View
      style={{
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(2),
        borderBottomWidth: 1,
        borderBottomColor: AppColors.LIGHTGRAY,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        <AppText
          title={`${item.id}-`}
          textColor={AppColors.BLACK}
          textSize={2}
          textFontWeight
        />
        <Image
          source={item.profImg}
          style={{width: 40, height: 40, borderRadius: 100}}
        />
        <AppText
          title={item.username}
          textColor={AppColors.BLACK}
          textSize={2}
          textFontWeight
        />
      </View>
      <View style={{paddingHorizontal: responsiveWidth(2)}}>
        <AppText
          title={item.numOfScore}
          textColor={AppColors.BLACK}
          textSize={2}
          textFontWeight
        />
      </View>
    </View>
  );
};

export default PointesProfile;
