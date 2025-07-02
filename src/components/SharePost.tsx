/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import { ImageBaseUrl } from '../BaseUrl';
import AppText from './AppTextComps/AppText';
import moment from 'moment';
import LineBreak from './LineBreak';
import AppButton from './AppButton';

const SharePost = ({ key, postData, item }) => {
  const navigation = useNavigation();
  console.log('item===>>>', item?.userId);
  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate('Community', { item: postData });
    }}>
      <View
        style={{
          marginHorizontal: responsiveHeight(2),
          gap: 10,
          marginTop: responsiveHeight(5),
          marginBottom: responsiveHeight(1.5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Image
            source={{ uri: `${ImageBaseUrl}${item?.userId?.image}` }}
            style={{ width: 45, height: 45, borderRadius: 100 }}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                gap: 7,
                alignItems: 'flex-end',
              }}>
              <AppText
                title={item?.userId?.username}
                textColor={AppColors.BLACK}
                textSize={1.8}
              />
            </View>
            <AppText
              title={moment(item?.sharedAt).fromNow()}
              textColor={AppColors.DARKGRAY}
              textSize={1.5}
            />
          </View>
        </View>
        <AppText
          title={item?.message}
          textColor={AppColors.BLACK}
          textSize={1.8}
        />
      </View>

      <View
        style={{
          borderWidth: 1,
          paddingHorizontal: responsiveWidth(4),
          paddingVertical: responsiveHeight(2),
          borderColor: AppColors.PEACHCOLOUR,
          borderRadius: 10,
        }}

      >
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
              source={{ uri: `${ImageBaseUrl}${postData.userId.image}` }}
              style={{ width: 45, height: 45, borderRadius: 100 }}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 7,
                  alignItems: 'flex-end',
                }}>
                <AppText
                  title={postData.userId.username}
                  textColor={AppColors.BLACK}
                  textSize={1.8}
                />
                <AppText
                  title={'added a new post'}
                  textColor={AppColors.DARKGRAY}
                  textSize={1.4}
                />
              </View>
              <AppText
                title={moment(postData.createdAt).fromNow()}
                textColor={AppColors.DARKGRAY}
                textSize={1.5}
              />
            </View>
          </View>

          <AppText
            title={'post'}
            textColor={AppColors.BTNCOLOURS}
            textSize={1.7}
            textFontWeight
          />
        </View>

        <LineBreak space={2} />

        <View
        // style={{
        //   borderWidth: 1,
        //   borderColor: AppColors.BLUE,
        //   borderRadius: 10,
        // }}
        >
          <LineBreak space={1} />
          <View
            style={
              { paddingHorizontal: responsiveWidth(3) }
            }>
            <AppText
              title={postData.Post_Caption}
              textColor={AppColors.BLACK}
              textSize={1.4}
            />
          </View>

          <LineBreak space={1} />

          <Image
            source={{ uri: `${ImageBaseUrl}${postData.Post_Image}` }}
            style={{
              borderRadius: 10,
              width: responsiveWidth(83),
              height: responsiveHeight(20),
            }}
          />
        </View>

      </View>
    </TouchableOpacity>
  );
};

export default SharePost;
