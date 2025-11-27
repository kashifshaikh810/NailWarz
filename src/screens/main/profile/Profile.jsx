/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Switch,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {clearToken} from '../../../Redux/Slices';
import {BaseUrl, ImageBaseUrl} from '../../../BaseUrl';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  deleteUser,
  editProfile,
  ShowToast,
} from '../../../GlobalFunctions/auth';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {getWalletByUserId} from '../../../GlobalFunctions';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userData, isGoogleSignIn} = useSelector(state => state.user);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {token} = useSelector(state => state.user);
  const [walletDetails, setWalletDetails] = useState();
  const focus = useIsFocused();
  const [isEnabled, setIsEnabled] = useState(userData?.notify);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({
    latitude: 37.4219983,
    longitude: -122.084,
  });
  console.log('address', address);

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
        <FontAwesome6
          name={'money-bill-wave'}
          size={responsiveFontSize(2.5)}
          color={AppColors.BTNCOLOURS}
        />
      ),
      title: 'Wallet',
      mrgnTop: 0,
      bottomWidth: 1,
      rightTxt: `$ ${walletDetails?.balance || '0'}.00`,
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
      title: 'Privacy & Safety',
      mrgnTop: 0,
      bottomWidth: 1,
      navTo: 'InstructionsScreen',
    },
    {
      id: 5,
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
      id: 6,
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
      id: 7,
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

  const data = [
    {
      id: 1,
      title: 'Name',
      value: userData?.username,
      Icon: FontAwesome,
      iconName: 'user-o',
    },
    {
      id: 2,
      title: 'Email',
      value: userData?.email,
      Icon: Ionicons,
      iconName: 'mail-outline',
    },
    {
      id: 3,
      title: 'Phone',
      value: userData?.phone ? userData?.phone : '-',
      Icon: Ionicons,
      iconName: 'call-outline',
    },
    {
      id: 4,
      title: 'Address',
      value: address ? address : '-',
      Icon: Ionicons,
      iconName: 'location-outline',
    },
    {
      id: 5,
      title: 'Wallet',
      value: `$ ${walletDetails?.balance || '0'}.00`,
      Icon: FontAwesome6,
      iconName: 'money-bill-wave',
    },

    {
      id: 6,
      title: 'Account Settings',
      Icon: Ionicons,
      iconName: 'settings-outline',
      navTo: 'Settings',
    },
    {
      id: 7,
      title: 'Payment Method',
      Icon: Ionicons,
      iconName: 'wallet-outline',
    },
    {
      id: 8,
      title: 'Privacy and safety',
      Icon: Ionicons,
      iconName: 'shield-checkmark-outline',
      navTo: 'InstructionsScreen',
    },
    {
      id: 9,
      title: 'About',
      Icon: Feather,
      iconName: 'alert-circle',
      navTo: 'InstructionsScreen',
    },
    {
      id: 10,
      title: 'Logout',
      Icon: MaterialIcons,
      iconName: 'logout',
    },
  ];
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
  const editProfileHandler = async () => {
    const res = await editProfile(
      userData._id,
      null,
      null,
      null,
      dispatch,
      null,
      false,
      !isEnabled,
    );
    console.log('res', res);
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
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            'User-Agent': 'ReactNativeApp',
          },
        },
      );

      const json = await response.json();
      const a = json.address;

      // Street-first priority
      const street =
        a.road || a.street || a.residential || a.pedestrian || a.house_number;

      const area =
        a.neighbourhood || a.suburb || a.village || a.town || a.city_district;

      const city = a.city || a.town || a.village || a.state_district;
      const state = a.state;
      const country = a.country;

      // Build final short address
      const parts = [street, area, city, state, country].filter(Boolean);

      const finalAddress = parts.slice(0, 3).join(', ');
      // takes only most relevant 3 parts

      console.log('Short Address:', finalAddress);
      setAddress(finalAddress);
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(position);
        setLatLng({latitude, longitude});
        fetchAddressFromCoords(latitude, longitude); // ✅ call here with params
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
  useEffect(() => {
    const initLocation = async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        console.log('granted', granted);
        getCurrentLocation();
      }
    };

    initLocation();
  }, []);
  const getWalletHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getWalletByUserId(token);
      setWalletDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const LogoutHandler = () => {
    if (isGoogleSignIn) {
      googleSignOut();
    } else {
      dispatch(clearToken());
    }
  };
  useEffect(() => {
    getWalletHandler();
  }, [focus]);

  const renderConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={confirmVisible}
      onRequestClose={() => setConfirmVisible(false)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: responsiveWidth(85),
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8,
          }}>
          <AppText
            title={'Are you sure you want to logout your account?'}
            textSize={2}
            textColor={AppColors.BLACK}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => setConfirmVisible(false)}
              style={{marginRight: 20}}>
              <AppText title="Cancel" textColor={AppColors.GRAY} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConfirmVisible(false);
                LogoutHandler();
              }}>
              <AppText title="Yes" textColor={AppColors.BLUE} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    // console.log('enabled',isEnabled
    // if (timeoutId) {
    //   clearTimeout(timeoutId); // cancel previous timeout
    // }

    // timeoutId = setTimeout(() => {
    editProfileHandler();
    // }, 2000);
  };
  console.log('userdata===', userData);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: AppColors.WHITE,
        padding: responsiveHeight(2),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: AppColors.WHITE}}>a</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(1.5),
          }}>
          <Image
            source={APPImages.logoSmall}
            style={{height: responsiveHeight(10), width: responsiveWidth(15)}}
          />
          <AppText
            title="Nailee Profile"
            textSize={2.1}
            textFontWeight
            textColor={AppColors.BTNCOLOURS}
          />
        </View>
        <View>
          <Image
            source={
              userData?.image
                ? {uri: `${ImageBaseUrl}${userData?.image}`}
                : APPImages.dummyImg
            }
            style={{
              height: responsiveHeight(5.7),
              width: responsiveWidth(11.8),
              borderRadius: responsiveHeight(5),
            }}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: AppColors.WHITE,
          elevation: 5,
          marginTop: responsiveHeight(3),
          padding: responsiveHeight(2),
          borderRadius: responsiveHeight(2),
        }}>
        <View style={{alignSelf: 'center'}}>
          <Image
            source={
              userData?.image
                ? {uri: `${ImageBaseUrl}${userData?.image}`}
                : APPImages.dummyImg
            }
            style={{
              height: responsiveHeight(9.7),
              width: responsiveWidth(20.3),
              borderRadius: responsiveHeight(5),
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{
              backgroundColor: AppColors.WHITE,
              elevation: 5,
              position: 'absolute',
              right: responsiveHeight(-0.9),
              bottom: responsiveHeight(-0.5),
              padding: responsiveHeight(0.5),
              borderRadius: responsiveHeight(2),
            }}>
            <Ionicons
              name="camera-outline"
              color={AppColors.BTNCOLOURS}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            backgroundColor: '#FDF1F1',
            elevation: 5,
            position: 'absolute',
            top: responsiveHeight(2),
            right: responsiveHeight(1),
            padding: responsiveHeight(0.7),
            borderRadius: responsiveHeight(2),
          }}>
          <MaterialIcons name="edit" color={AppColors.BTNCOLOURS} size={25} />
        </TouchableOpacity>
        <LineBreak space={5} />
        {renderConfirmModal()}
        <View>
          <FlatList
            data={data}
            contentContainerStyle={{gap: responsiveHeight(2)}}
            renderItem={({item, index}) => {
              const Icon = item.Icon;
              const Item = item.value ? View : TouchableOpacity;

              return (
                <Item
                  {...(!item.value && {
                    onPress: () => {
                      if (item?.id === 10) {
                        setConfirmVisible(true);
                      } else if (item.title === 'Payment Method') {
                        navigation.navigate('SelectPaymentMethod', {
                          bookingId: null,
                          price: null,
                          pay: false,
                        });
                      } else if (item.navTo) {
                        navigation.navigate(item.navTo, {type: item?.title});
                      }
                    },
                  })}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: responsiveHeight(2),
                      }}>
                      <Icon
                        name={item?.iconName}
                        color={AppColors.BTNCOLOURS}
                        size={20}
                      />
                      <AppText
                        title={item.title}
                        textColor={AppColors.BTNCOLOURS}
                        textSize={1.9}
                      />
                    </View>

                    {item?.value ? (
                      <AppText
                        title={item.value}
                        numberOfLines={1}
                        textwidth={50}
                        textAlignment={'right'}
                        styles={{fontWeight: '700'}}
                        textSize={1.9}
                      />
                    ) : (
                      <Ionicons name="chevron-forward-outline" size={25} />
                    )}
                  </View>

                  <LineBreak space={1} />
                  <View
                    style={{
                      borderBottomWidth: 2,
                      borderBlockColor: AppColors.WHITE2,
                    }}
                  />
                </Item>
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
