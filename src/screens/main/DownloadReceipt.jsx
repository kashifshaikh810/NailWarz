/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';

const sectionDataOne = [
  {id: 1, title: 'Salon', subTitle: 'Nails'},
  {id: 2, title: 'Customer Name', subTitle: 'John Doe'},
  {id: 3, title: 'Phone', subTitle: '+1 123 456 789'},
  {id: 4, title: 'Booking Date', subTitle: 'September 10, 2024'},
  {id: 5, title: 'Booking Time', subTitle: '9:30 AM'},
  {id: 6, title: 'Stlyist', subTitle: 'Any'},
];

const sectionDataTwo = [
  {id: 1, title: 'Dip Powder Nails', subTitle: '$10.00'},
  {id: 2, title: 'Dip Powder Nails', subTitle: '$5.00'},
  {id: 3, title: 'Discount', subTitle: '$3.00'},
];

const DownloadReceipt = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader onPress={() => navigation.goBack()} title="Receipt" />

      <View
        style={{
          paddingHorizontal: responsiveWidth(5),
          marginVertical: responsiveHeight(2),
        }}>
        <View
          style={{
            backgroundColor: AppColors.WHITE,
            borderRadius: 10,
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(4),
          }}>
          <FlatList
            data={sectionDataOne}
            ItemSeparatorComponent={() => <LineBreak space={1.5} />}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText
                    title={item.title}
                    textSize={2}
                    textColor={AppColors.BLACK}
                  />
                  <AppText
                    title={item.subTitle}
                    textSize={2}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>
              );
            }}
          />
        </View>

        <LineBreak space={2} />

        <View
          style={{
            backgroundColor: AppColors.WHITE,
            borderRadius: 10,
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(4),
          }}>
          <FlatList
            data={sectionDataTwo}
            ItemSeparatorComponent={() => <LineBreak space={1.5} />}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <AppText
                    title={item.title}
                    textSize={2}
                    textColor={AppColors.BLACK}
                  />
                  <AppText
                    title={item.subTitle}
                    textSize={2}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: AppColors.WHITE,
          paddingHorizontal: responsiveWidth(4),
        }}>
        <AppButton
          title="Download Receipt"
          handlePress={() => {}}
          //   bgColor={AppColors.DARKGRAY}
          //   textColor={AppColors.WHITE}
        />
      </View>

      <LineBreak space={2} />
    </View>
  );
};

export default DownloadReceipt;
