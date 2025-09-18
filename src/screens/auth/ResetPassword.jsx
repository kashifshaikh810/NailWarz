/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import AppText from '../../components/AppTextComps/AppText';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppTextInput from '../../components/AppTextInput';
import AppColors from '../../utils/AppColors';
import AppButton from '../../components/AppButton';
import APPImages from '../../assets/APPImages';
import {setNewPassword, ShowToast} from '../../GlobalFunctions/auth';

import LineBreak from '../../components/LineBreak';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const ResetPassword = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {email} = route?.params;

  const resetPasswordHandler = async () => {
    if (password !== confirmPassword) {
      return ShowToast('error', 'Passwords must be same');
    }
    try {
      setIsLoading(true);
      const response = await setNewPassword(email, password);
      if (response.success) {
        ShowToast('success', response.message);
        navigation.navigate('Login');
      } else {
        ShowToast('error', response.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingTop: responsiveHeight(4),
          backgroundColor: AppColors.WHITE,
        }}>
        <View style={{gap: 20, flex: 1}}>
          <View style={{flex: 1}}>
            <View style={{}}>
              <AppText
                title="Enter Your Passsword"
                textColor={AppColors.BLACK}
                textSize={3}
                textAlignment="center"
                textFontWeight={700}
              />
              <AppText
                mrgnTop={1}
                textAlignment="center"
                title="Now you can create new password and
confirm a below"
                textColor={AppColors.BLACK}
                textSize={2}
                // textFontWeight={700}
              />
            </View>
            <LineBreak space={3} />
            <View style={{gap: responsiveHeight(2)}}>
              <AppTextInput
                onChangeText={value => setPassword(value)}
                inputPlaceHolder={'New Password'}
                containerBg={AppColors.WHITE2}
              />
              <AppTextInput
                onChangeText={value => setConfirmPassword(value)}
                inputPlaceHolder={'Confirm New Password'}
                containerBg={AppColors.WHITE2}
              />
            </View>
            {/* <LineBreak space={4} /> */}
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <AppButton
                title={
                  isLoading ? (
                    <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                  ) : (
                    'Confirm New Password'
                  )
                }
                handlePress={resetPasswordHandler}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
