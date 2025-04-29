/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import AppButton from '../../../components/AppButton';
import APPImages from '../../../assets/APPImages';
import LineBreak from '../../../components/LineBreak';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const profileMenus = [
  {
    id: 1,
    iconName: (
      <Fontisto
        name={'player-settings'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Settings',
    mrgnTop: 0,
    bottomWidth: 1,
    borderTopRadius: 10,
  },
  {
    id: 2,
    iconName: (
      <FontAwesome
        name={'user-circle-o'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Account Details',
    mrgnTop: 0,
    bottomWidth: 0,
    borderBottomRadius: 10,
  },
  {
    id: 3,
    iconName: (
      <FontAwesome5
        name={'wallet'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Payment Method',
    mrgnTop: 2,
    bottomWidth: 1,
    borderTopRadius: 10,
  },
  {
    id: 4,
    iconName: (
      <Ionicons
        name={'shield-checkmark-outline'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Privacy and safety',
    mrgnTop: 0,
    bottomWidth: 1,
  },
  {
    id: 5,
    iconName: (
      <MaterialCommunityIcons
        name={'hand-front-left-outline'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Accessibility, display and languages',
    mrgnTop: 0,
    bottomWidth: 1,
  },
  {
    id: 6,
    iconName: (
      <Fontisto
        name={'bell'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Notifications',
    mrgnTop: 0,
    bottomWidth: 0,
    borderBottomRadius: 10,
  },
  {
    id: 7,
    iconName: (
      <AntDesign
        name={'message1'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Help and Services',
    mrgnTop: 2,
    bottomWidth: 1,
    borderTopRadius: 10,
  },
  {
    id: 8,
    iconName: (
      <Feather
        name={'alert-circle'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'About',
    mrgnTop: 0,
    bottomWidth: 1,
  },
  {
    id: 9,
    iconName: (
      <AntDesign
        name={'logout'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Logout',
    mrgnTop: 0,
    bottomWidth: 0,
    borderBottomRadius: 10,
  },
];

const Profile = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title="Profile" />

      <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <View style={{alignItems: 'center', gap: 20}}>
          <View
            style={{
              borderWidth: 2,
              width: 110,
              height: 110,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={APPImages.nailsTwo}
              style={{width: 100, height: 100, borderRadius: 100}}
            />
          </View>
          <AppText
            title={'Charles James'}
            textColor={AppColors.BLACK}
            textSize={2.5}
            textFontWeight
          />
          <View style={{width: responsiveWidth(30)}}>
            <AppButton
              title={`Edit Profile`}
              handlePress={() => navigation.navigate('EditProfile')}
            />
          </View>
        </View>

        <LineBreak space={3} />

        <FlatList
          data={profileMenus}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  backgroundColor: '#eaeaea',
                  marginTop: responsiveHeight(item.mrgnTop),
                  paddingHorizontal: responsiveWidth(4),
                  borderTopLeftRadius: item.borderTopRadius
                    ? item.borderTopRadius
                    : 0,
                  borderBottomLeftRadius: item.borderBottomRadius
                    ? item.borderBottomRadius
                    : 0,
                  borderTopRightRadius: item.borderTopRadius
                    ? item.borderTopRadius
                    : 0,
                  borderBottomRightRadius: item.borderBottomRadius
                    ? item.borderBottomRadius
                    : 0,
                }}>
                <View
                  style={{
                    borderBottomColor: AppColors.DARKGRAY,
                    borderBottomWidth:
                      item.bottomWidth === 1 ? item.bottomWidth : 0,
                    paddingVertical: responsiveHeight(2),
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  {item.iconName}
                  <AppText
                    title={item?.title}
                    textColor={AppColors.BLACK}
                    textSize={2}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={3} />
      </View>
    </ScrollView>
  );
};

export default Profile;
