/* eslint-disable react-native/no-inline-styles */
import { View, Image } from 'react-native';
import React from 'react';
import moment from 'moment';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APPImages from '../assets/APPImages';
import { ImageBaseUrl } from '../BaseUrl';

interface ReviewCardProps {
  data?: object;
}
const ReviewsCard: React.FC<ReviewCardProps> = ({ data }) => {
  return (
    <View style={{
      padding: responsiveHeight(2), backgroundColor: AppColors.WHITE, elevation: 6, shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5, borderRadius: responsiveHeight(1.5)
    }}>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(3.3), justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: responsiveHeight(2), alignItems: 'center' }}>
          <Image source={data?.userId?.image ? { uri: `${ImageBaseUrl}${data?.userId?.image}` } : APPImages.dummyImg} style={{ height: responsiveHeight(7), width: responsiveWidth(14), borderRadius: responsiveHeight(4) }} />
          <View>
            <AppText textColor="#1E1E1E" title={data?.userId?.username} textFontWeight textSize={2} />
            <AppText title={moment(`${data?.createdAt}`).fromNow()} textColor="#9DA5B3" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
          <AntDesign name="star" color={AppColors.RED} size={20} />
          <AppText title={data?.stars} />
        </View>
      </View>
      <AppText textColor="#9096A1" mrgnTop={2} textSize={1.9} title={data?.message} />
    </View>
  );
};

export default ReviewsCard;
