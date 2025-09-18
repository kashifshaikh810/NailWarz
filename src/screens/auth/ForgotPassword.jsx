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

import {forgotPasswordIntegration, ShowToast} from '../../GlobalFunctions/auth';

import LineBreak from '../../components/LineBreak';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const forgotPasswordHandler = async () => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordIntegration(email);
      setIsLoading(false);

      console.log('response', response);
      if (response.success) {
        ShowToast('success', response.message);
        navigation.navigate('Otp', {
          email: response.data.email,
          forgotPassword: true,
        });
      } else {
        ShowToast('error', response.message);
      }
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
                title="Forgot Password"
                textColor={AppColors.BLACK}
                textSize={3}
                textAlignment="center"
                textFontWeight={700}
              />
              <AppText
                mrgnTop={1}
                title="Enter your email or phone number to receive a secure one- time passcode (OTP) and reset your password."
                textColor={AppColors.subTitle}
                textSize={2}
                textAlignment="center"
                // textFontWeight={700}
              />
            </View>
            <LineBreak space={3} />

            <AppTextInput
              onChangeText={value => setEmail(value)}
              keyboardType="email-address"
              onChangeText={value => setEmail(value)}
              inputPlaceHolder={'Email Address or Phone Number'}
              containerBg="#F5F5F5"
            />
            <LineBreak space={4} />
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <AppButton
                title={
                  isLoading ? (
                    <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                  ) : (
                    'Send Code'
                  )
                }
                handlePress={forgotPasswordHandler}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
