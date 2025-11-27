/* eslint-disable react-native/no-inline-styles */
import {View, Text, FlatList, Switch, TouchableOpacity} from 'react-native';
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
            elevation: 5,
          }}>
          <AppText
            title={'Are you sure you want to delete your account?'}
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
                deleteAccountHandler();
              }}>
              <AppText title="Yes" textColor={AppColors.BLUE} />
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
                    <Switch
                      trackColor={{false: '#767577', true: AppColors.LIGHTGRAY}}
                      thumbColor={isEnabled ? AppColors.WHITE : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
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
