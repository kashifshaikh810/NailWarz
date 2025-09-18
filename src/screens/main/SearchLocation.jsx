/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  responsiveFontSize,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const recentLocations = [
  {id: 1, title: 'Long Beach Port', subTitle: 'Long Beach, California'},
  {id: 2, title: 'Times Square', subTitle: 'New York, New York'},
  {id: 3, title: 'Hollywood Boulevard', subTitle: 'Los Angeles, California'},
  {id: 4, title: 'French Quarter', subTitle: 'New Orleans, Louisiana'},
  {id: 5, title: 'Space Needle', subTitle: 'Long Beach, California'},
  {id: 6, title: 'Las Vegas Strip', subTitle: 'Las Vegas, Nevada'},
];

const SearchLocation = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title={'Search Location'}
        />

        <LineBreak space={1} />

        <View
          style={{
            paddingHorizontal: responsiveWidth(4),
          }}>
          <AppTextInput
            containerBg={AppColors.INPUTBG}
            inputPlaceHolder={'Enter address or city name'}
            logo={
              <AntDesign
                name={'search1'}
                size={responsiveFontSize(2)}
                color={AppColors.BLACK}
              />
            }
          />

          <LineBreak space={3} />

          <AppText
            title="Recent Locations"
            textSize={2.5}
            textColor={AppColors.BLACK}
            textFontWeight
          />

          <LineBreak space={2} />

          <FlatList
            data={recentLocations}
            ItemSeparatorComponent={() => <LineBreak space={2} />}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <EvilIcons
                      name={'location'}
                      color={AppColors.BLACK}
                      size={responsiveFontSize(4)}
                    />
                    <View>
                      <AppText
                        title={item.title}
                        textSize={2.2}
                        textColor={AppColors.BLACK}
                      />
                      <AppText
                        title={item.subTitle}
                        textSize={2}
                        textColor={AppColors.DARKGRAY}
                      />
                    </View>
                  </View>
                  <TouchableOpacity>
                    <EvilIcons
                      name={'close'}
                      color={AppColors.BLACK}
                      size={responsiveFontSize(3)}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchLocation;
