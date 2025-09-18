/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {clearToken} from '../../../Redux/Slices';
import {BaseUrl, ImageBaseUrl} from '../../../BaseUrl';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {deleteUser, ShowToast} from '../../../GlobalFunctions/auth';
import ConfirmationModal from '../../../components/ConfirmationModal';

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
    // bottomWidth: 1,
    borderTopRadius: 10,
    borderBottomRadius: 10,
    navTo: 'Settings',
  },
  {
    id: 2,
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
    id: 3,
    iconName: (
      <Ionicons
        name={'shield-checkmark-outline'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Privacy & Safety',
    mrgnTop: 0,
    bottomWidth: 1,
    navTo: 'InstructionsScreen',
  },
  {
    id: 4,
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
    navTo: 'InstructionsScreen',
  },
  {
    id: 5,
    iconName: (
      <AntDesign
        name="delete"
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Delete Account',
    mrgnTop: 0,
    borderBottomRadius: 10,
    // bottomWidth: 1,
    navTo: 'Auth',
  },
  // {
  //   id: 6,
  //   iconName: (
  //     <Fontisto
  //       name={'bell'}
  //       size={responsiveFontSize(2.5)}
  //       color={AppColors.BTNCOLOURS}
  //     />
  //   ),
  //   title: 'Notifications',
  //   mrgnTop: 0,
  //   bottomWidth: 0,
  //   borderBottomRadius: 10,
  // },
  // {
  //   id: 7,
  //   iconName: (
  //     <AntDesign
  //       name={'message1'}
  //       size={responsiveFontSize(2.5)}
  //       color={AppColors.BTNCOLOURS}
  //     />
  //   ),
  //   title: 'Help and Services',
  //   mrgnTop: 2,
  //   bottomWidth: 1,
  //   borderTopRadius: 10,
  // },
  // {
  //   id: 8,
  //   iconName: (
  //     <Feather
  //       name={'alert-circle'}
  //       size={responsiveFontSize(2.5)}
  //       color={AppColors.BTNCOLOURS}
  //     />
  //   ),
  //   title: 'About',
  //   mrgnTop: 0,
  //   bottomWidth: 1,
  // },
  {
    id: 6,
    iconName: (
      <AntDesign
        name={'logout'}
        size={responsiveFontSize(2.5)}
        color={AppColors.BTNCOLOURS}
      />
    ),
    title: 'Logout',
    mrgnTop: 1,
    bottomWidth: 0,
    borderTopRadius: 10,
    borderBottomRadius: 10,
    navTo: 'Auth',
  },
];

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userData, isGoogleSignIn} = useSelector(state => state.user);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // GoogleSignin.configure({});
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '985993038096-pg0pmp2tdn6hpv9pij38arci06kpuc4p.apps.googleusercontent.com', // ✅ must be web client
      offlineAccess: true,
    });
  }, []);
  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      dispatch(clearToken());
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  };

  const deleteAccountHandler = async () => {
    setIsLoading(true);
    try {
      const response = await deleteUser(userData?._id);
      if (response.success) {
        setDeleteModalVisible(false);
        if (isGoogleSignIn) {
          googleSignOut();
        } else {
          dispatch(clearToken());
        }
        ShowToast('success', 'Account Deleted Successfully');
      } else {
        ShowToast('error', response.message);
      }
      setIsLoading(false);
    } catch (error) {
      ShowToast('error', error?.response?.data?.message);
      setIsLoading(false);
    }
  };
  console.log('userdata===', userData);
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
              source={
                userData?.image
                  ? {uri: `${ImageBaseUrl}${userData?.image}`}
                  : APPImages.dummyImg
              }
              style={{width: 100, height: 100, borderRadius: 100}}
            />
          </View>
          <AppText
            title={userData?.username}
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
                }}
                onPress={() => {
                  if (item.title === 'Logout') {
                    if (isGoogleSignIn) {
                      googleSignOut();
                    } else {
                      dispatch(clearToken());
                    }
                    return;
                  } else if (item.title === 'Delete Account') {
                    setDeleteModalVisible(true);
                  } else if (item.title === 'Payment Method') {
                    navigation.navigate('SelectPaymentMethod', {
                      bookingId: null,
                      price: null,
                      pay: false,
                    });
                  }
                  if (item.navTo) {
                    navigation.navigate(item.navTo, {type: item?.title});
                  }
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
        <ConfirmationModal
          flexDirection="row"
          isLoading={isLoading}
          justifyContent="space-between"
          btn1Width={39}
          btn2Width={39}
          iconName={'delete'}
          title={'Delete Account'}
          subTitle={'Are you sure you want to delete this account'}
          buttonTwoTitle={'Cancel'}
          buttonOneTitle={'Confirm'}
          visible={deleteModalVisible}
          // setVisible={() => {
          //   navigation.navigate('DownloadReceipt');
          //   setVisibleConfirmationModal(false);
          // }}
          handleBackPress={() => {
            setDeleteModalVisible(false);
          }}
          setVisible={() => {
            deleteAccountHandler();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Profile;
