/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APPImages from '../../../assets/APPImages';
import LineBreak from '../../../components/LineBreak';
import AppButton from '../../../components/AppButton';

const posts = [
  {
    id: 1,
    name: 'Charles James',
    time: '7h',
    desc: 'Lorem ipsum simply dummy amet, consectetur sadipscing elitr, sed',
    profImg: APPImages.NAILS,
    saloonImg: APPImages.NAILS,
  },
  {
    id: 2,
    name: 'Charles James',
    time: '7h',
    desc: 'Lorem ipsum simply dummy amet, consectetur sadipscing elitr, sed',
    profImg: APPImages.NAILS,
    saloonImg: APPImages.NAILS,
  },
];

const Warz = () => {
  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <View
        style={{
          paddingHorizontal: responsiveWidth(4),
          paddingVertical: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <AppText title="WARZ" textColor={AppColors.BLACK} textSize={2.5} />
            <View style={{width: responsiveWidth(60)}}>
              <AppText
                title="Current Warriors in NAIL WARZ. VOTE NOW Below for your favorite nail set"
                textColor={AppColors.BLACK}
                textSize={1.4}
              />
            </View>
          </View>
          <Ionicons
            name={'notifications-outline'}
            size={responsiveFontSize(3)}
            color={AppColors.BLACK}
          />
        </View>
        <LineBreak space={2} />

        <FlatList
          data={posts}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveHeight(2),
                  borderColor: AppColors.PEACHCOLOUR,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <Image
                      source={item.profImg}
                      style={{width: 45, height: 45, borderRadius: 100}}
                    />
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 7,
                          alignItems: 'center',
                        }}>
                        <AppText
                          title={item.name}
                          textColor={AppColors.BLACK}
                          textSize={1.8}
                        />
                        <AppText
                          title={'added a new poll'}
                          textColor={AppColors.DARKGRAY}
                          textSize={1.4}
                        />
                      </View>
                      <AppText
                        title={item.time}
                        textColor={AppColors.DARKGRAY}
                        textSize={1.5}
                      />
                    </View>
                  </View>

                  <AppText
                    title={'poll'}
                    textColor={AppColors.BTNCOLOURS}
                    textSize={1.7}
                    textFontWeight
                  />
                </View>

                <LineBreak space={2} />

                <AppText
                  title={item.desc}
                  textColor={AppColors.BLACK}
                  textSize={1.4}
                />

                <LineBreak space={1} />

                <Image
                  source={item.saloonImg}
                  style={{
                    borderRadius: 10,
                    width: responsiveWidth(85),
                    height: responsiveHeight(20),
                  }}
                />

                <LineBreak space={1.5} />

                <AppButton title={`VOTE`} handlePress={() => {}} />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Warz;
