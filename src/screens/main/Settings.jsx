/* eslint-disable react-native/no-inline-styles */
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import {deleteUser, editProfile, ShowToast} from '../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import {clearToken} from '../../Redux/Slices';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';

const Settings = ({navigation}) => {
  const {userData, isGoogleSignIn} = useSelector(state => state?.user);
  const [isEnabled, setIsEnabled] = useState(userData?.notify);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [actionType, setActionType] = useState(''); // 'logout' or 'delete'
  console.log('isEnabled', isEnabled);
  const data = [
    // {
    //   id: 1,
    //   title: 'Accessibility, display and languages',
    //   iconName: 'hand-right-outline',
    //   toggle: false,
    //   navTo: 'Accessebility',
    // },
    {
      id: 1,
      title: 'Notifications',
      Icon: Ionicons,
      iconName: 'notifications-outline',
      toggle: true,
    },
    {
      id: 2,
      title: 'Delete Account',
      Icon: MaterialIcons,
      iconName: 'logout',
      toggle: false,
    },
    // {
    //   id: 3,
    //   title: 'Logout',
    //   Icon: MaterialIcons,
    //   iconName: 'logout',
    // },
  ];
  const editProfileHandler = async () => {
    await editProfile(
      userData._id,
      null,
      null,
      null,
      dispatch,
      null,
      false,
      !isEnabled,
      null,
    );
  };
  let timeoutId;
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
  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      dispatch(clearToken());
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  };
  const LogoutHandler = () => {
    if (isGoogleSignIn) {
      googleSignOut();
    } else {
      dispatch(clearToken());
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
          paddingHorizontal: responsiveWidth(6),
        }}>
        <View
          style={{
            width: responsiveWidth(82),
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: responsiveHeight(2.2),
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 6},
            shadowOpacity: 0.2,
            shadowRadius: 14,
            elevation: 12,
          }}>
          <AppText
            title="Delete Account?"
            textSize={2.3}
            textColor={AppColors.BLACK}
            textFontWeight
          />
          <AppText
            title="Are you sure you want to delete your account? This action cannot be undone."
            textSize={1.75}
            textColor={AppColors.DARKGRAY}
            mrgnTop={1}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: responsiveHeight(2.4),
            }}>
            <TouchableOpacity
              onPress={() => setConfirmVisible(false)}
              style={{
                minWidth: responsiveWidth(22),
                paddingVertical: responsiveHeight(1.1),
                paddingHorizontal: responsiveWidth(3),
                borderRadius: 8,
                alignItems: 'center',
                marginRight: responsiveWidth(2),
                backgroundColor: '#F2F2F2',
              }}>
              <AppText
                title="Cancel"
                textColor={AppColors.BLACK}
                textSize={1.7}
                textFontWeight
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setConfirmVisible(false);
                deleteAccountHandler();
              }}
              style={{
                minWidth: responsiveWidth(22),
                paddingVertical: responsiveHeight(1.1),
                paddingHorizontal: responsiveWidth(3),
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: AppColors.BTNCOLOURS,
              }}>
              <AppText
                title="Delete"
                textColor={AppColors.WHITE}
                textSize={1.7}
                textFontWeight
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  // chevron-forward-outline
  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title="Account Settings" />
      {renderConfirmModal()}
      <View style={{marginTop: responsiveHeight(2)}}>
        <FlatList
          data={data}
          renderItem={({item, index}) => {
            const Icon = item.Icon;
            return (
              <TouchableOpacity
                onPress={() =>
                  item.toggle ? toggleSwitch() : setConfirmVisible(true)
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: responsiveHeight(2),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: responsiveHeight(1),
                    }}>
                    <Icon
                      name={item.iconName}
                      size={25}
                      color={AppColors.iconColor}
                    />
                    <AppText
                      textSize={2}
                      title={item.title}
                      textColor={AppColors.BLACK}
                    />
                  </View>
                  {item.toggle ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={event => {
                        event.stopPropagation?.();
                        toggleSwitch();
                      }}
                      style={{
                        width: responsiveWidth(13),
                        height: responsiveHeight(3.2),
                        borderRadius: responsiveHeight(2),
                        padding: responsiveHeight(0.35),
                        backgroundColor: isEnabled
                          ? AppColors.BTNCOLOURS
                          : '#D1D1D6',
                        alignItems: isEnabled ? 'flex-end' : 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <View
                        style={{
                          width: responsiveHeight(2.5),
                          height: responsiveHeight(2.5),
                          borderRadius: responsiveHeight(1.25),
                          backgroundColor: AppColors.WHITE,
                          elevation: 2,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 1},
                          shadowOpacity: 0.2,
                          shadowRadius: 1.5,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <Ionicons name="chevron-forward-outline" size={25} />
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    height: responsiveHeight(0.1),
                    width: '100%',
                    backgroundColor: AppColors.borderColor,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
