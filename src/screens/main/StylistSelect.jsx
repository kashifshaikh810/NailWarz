/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AppText from '../../components/AppTextComps/AppText';
import APPImages from '../../assets/APPImages';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';

const cardData = [
  {
    id: 1,
    profImg: APPImages.CENTRALSALOONS,
    name: 'John Doe',
    designation: 'Nail Technician',
    ratingStatus: 'Top Rated',
  },
  {
    id: 2,
    profImg: APPImages.CENTRALSALOONS,
    name: 'Anna Lee',
    designation: 'Nail Technician',
    ratingStatus: 'Top Rated',
  },
  {
    id: 3,
    profImg: APPImages.CENTRALSALOONS,
    name: 'Ella Ford',
    designation: 'Nail Technician',
    ratingStatus: '',
  },
  {
    id: 4,
    profImg: APPImages.CENTRALSALOONS,
    name: 'Marsh Donnell',
    designation: 'Nail Technician',
    ratingStatus: '',
  },
];

const StylistSelect = () => {
  const navigation = useNavigation();
  const [isSelectedProfile, setIsSelectedProfile] = useState({});

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title="Choose Your Nail Technician"
      />

      <View
        style={{
          paddingHorizontal: responsiveWidth(3),
          marginVertical: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: responsiveWidth(10),
            borderRadius: 10,
            borderWidth: isSelectedProfile?.id ? 2 : 0,
            borderColor: AppColors.BLUE,
            gap: responsiveWidth(8),
            paddingHorizontal: responsiveWidth(5),
            paddingVertical: responsiveHeight(3),
            alignItems: 'center',
            backgroundColor: AppColors.WHITE,
          }}>
          <Feather
            name={'users'}
            size={responsiveFontSize(3)}
            color={AppColors.BLUE}
          />
          <View>
            <AppText
              title="Any Nail Technician"
              textSize={2}
              textColor={AppColors.BLACK}
            />

            <AppText
              title="Next available nail technician"
              textSize={1.8}
              textColor={AppColors.DARKGRAY}
            />
          </View>
        </View>

        <LineBreak space={2} />

        <FlatList
          data={cardData}
          ItemSeparatorComponent={() => <LineBreak space={2} />}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => setIsSelectedProfile({id: item.id})}
                style={{
                  flexDirection: 'row',
                  paddingLeft: responsiveWidth(5),
                  borderRadius: 10,
                  gap: responsiveWidth(5),
                  paddingVertical: responsiveHeight(3),
                  alignItems: 'center',
                  backgroundColor: isSelectedProfile.id === item.id ? AppColors.BTNCOLOURS : AppColors.WHITE,
                }}>
                <Image
                  source={item.profImg}
                  style={{
                    width: responsiveWidth(15),
                    height: responsiveHeight(8),
                  }}
                />
                <View>
                  <AppText
                    title={item.name}
                    textSize={2.2}
                    textColor={isSelectedProfile.id === item.id ? AppColors.WHITE : AppColors.BLACK}
                  />

                  <AppText
                    title={item.designation}
                    textSize={1.9}
                    textColor={isSelectedProfile.id === item.id ? AppColors.WHITE : AppColors.DARKGRAY}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: item.ratingStatus
                        ? AppColors.PEACHCOLOUR
                        : isSelectedProfile.id === item.id ? AppColors.BTNCOLOURS : AppColors.WHITE,
                      gap: 10,
                    }}>
                    {item.ratingStatus && (
                      <SimpleLineIcons
                        name={'badge'}
                        size={responsiveFontSize(1.8)}
                        color={AppColors.BLACK}
                      />
                    )}
                    <AppText
                      title={item.ratingStatus}
                      textSize={1.8}
                      textColor={AppColors.BLACK}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={4} />

        <AppButton
          title="Select & Continue"
          handlePress={() => navigation.navigate('DateAndTimeSelection')}
          // bgColor={AppColors.DARKGRAY}
          // textColor={AppColors.WHITE}
        />
      </View>
    </ScrollView>
  );
};

export default StylistSelect;
