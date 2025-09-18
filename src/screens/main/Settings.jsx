/* eslint-disable react-native/no-inline-styles */
import {View, Text, FlatList, Switch, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import {editProfile} from '../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../GlobalFunctions/styles';
const Settings = ({navigation}) => {
  const {userData} = useSelector(state => state?.user);
  const [isEnabled, setIsEnabled] = useState(userData?.notify);
  const dispatch = useDispatch();
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
      iconName: 'notifications-outline',
      toggle: true,
    },
    {
      id: 2,
      title: 'Help and Services',
      iconName: 'chatbubble-ellipses-outline',
      toggle: false,
      navTo: 'InstructionsScreen',
    },
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
  // chevron-forward-outline
  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title="Settings" />
      <View style={{marginTop: responsiveHeight(2)}}>
        <FlatList
          data={data}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  item.toggle
                    ? toggleSwitch()
                    : navigation.navigate(item?.navTo, {
                        type: item.title,
                      })
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
                    <Ionicons
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
