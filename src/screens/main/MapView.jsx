/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import APPImages from '../../assets/APPImages';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterModal from '../../components/FilterModal';

const data = [
  {
    id: 1,
    productImage: APPImages.NAILS,
    title: 'Nail Avenue',
    km: '2 km',
    location: 'Lakewood, California',
    rating: 4.7,
    numbers: 312,
  },
  {
    id: 2,
    productImage: APPImages.NAILS,
    title: 'Saloon',
    km: '4 km',
    location: 'Northwood, California',
    rating: 4.2,
    numbers: 322,
  },
  {
    id: 1,
    productImage: APPImages.NAILS,
    title: 'Saloon',
    km: '4 km',
    location: 'Northwood, California',
    rating: 4.2,
    numbers: 322,
  },
];

const MapView = () => {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title={'Map View'} />

      <FilterModal 
      visible={showFilterModal}
      setVisible={setShowFilterModal}
      />

      <View
        style={{
          backgroundColor: AppColors.WHITE,
          paddingBottom: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(5),
          }}>
          <AppTextInput
            containerBg={AppColors.INPUTBG}
            inputPlaceHolder={'Lakewood, California'}
            inputWidth={55}
            logo={
              <EvilIcons
                name={'location'}
                size={responsiveFontSize(2.7)}
                color={AppColors.BLUE}
              />
            }
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              borderRadius: 10,
              paddingHorizontal: responsiveWidth(3),
              borderWidth: 1,
              borderColor: AppColors.INPUTBG,
            }}
            onPress={() => setShowFilterModal(true)}
            >
            <MaterialCommunityIcons
              name={'tune-vertical'}
              size={responsiveFontSize(3)}
              color={AppColors.BLACK}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground
        source={APPImages.map}
        style={{
          flex: 1,
          paddingLeft: responsiveWidth(5),
          paddingRight: responsiveWidth(1.5),
          justifyContent: 'flex-end',
        }}>
        <FlatList
          data={data}
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 20}}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                   activeOpacity={0.7}
                  style={{
                    backgroundColor: AppColors.WHITE,
                    paddingVertical: responsiveHeight(2),
                    paddingHorizontal: responsiveWidth(4),
                    borderRadius: 15,
                  }}
                  onPress={() => navigation.navigate('HomeDetails')}
                  >
                  <ImageBackground
                    imageStyle={{borderRadius: 15}}
                    source={item.productImage}
                    style={{
                      width: responsiveWidth(70),
                      height: responsiveHeight(15),
                      alignItems: 'flex-end',
                    }}>
                    <View
                      style={{
                        paddingHorizontal: responsiveWidth(5),
                        paddingVertical: responsiveHeight(2),
                      }}>
                      <TouchableOpacity>
                        <AntDesign
                          name={'hearto'}
                          size={responsiveFontSize(2.7)}
                          color={AppColors.WHITE}
                        />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                  <LineBreak space={1} />

                  <View style={{gap: 5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}>
                      <AppText
                        title={item.title}
                        textColor={AppColors.BLACK}
                        textSize={2.5}
                        textFontWeight
                      />
                      <AppText
                        title={item.km}
                        textColor={AppColors.DARKGRAY}
                        textSize={2}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}>
                      <Ionicons
                        name={'location-outline'}
                        size={responsiveFontSize(2)}
                        color={AppColors.DARKGRAY}
                      />
                      <AppText
                        title={item.location}
                        textSize={2}
                        textColor={AppColors.DARKGRAY}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}>
                      <Entypo
                        name={'star'}
                        size={responsiveFontSize(2.5)}
                        color={'#FFD33C'}
                      />
                      <AppText title={item.rating} textSize={2} />
                      <AppText
                        title={`(${item.numbers})`}
                        textSize={1.5}
                        textColor={AppColors.DARKGRAY}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <LineBreak space={4} />
      </ImageBackground>
    </View>
  );
};

export default MapView;
