/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import AppText from '../../components/AppTextComps/AppText';
import BackgroundScreen from '../../components/AppTextComps/BackgroundScreen';
import AppColors from '../../utils/AppColors';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppButton from '../../components/AppButton';
import {
  forgotPasswordIntegration,
  ShowToast,
  verifyOtp,
  verifyPasswordOtp,
} from '../../GlobalFunctions/auth';
import {useDispatch} from 'react-redux';

const Otp = ({navigation, route}) => {
  const [value, setValue] = useState();
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [isLoading, setIsLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const dispatch = useDispatch();

  const {token, email, phone, forgotPassword} = route?.params;
  console.log('forgotPassword', forgotPassword);
  const forgotPasswordHandler = async () => {
    setResendOtpLoading(true);
    try {
      const response = await forgotPasswordIntegration(email);
      setResendOtpLoading(false);

      console.log('response', response);
      if (response.success) {
        ShowToast('success', response.message);
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      setResendOtpLoading(false);
    }
  };
  const handleOtpVerification = async () => {
    if (!value) {
      return ShowToast('error', 'Plz Enter Your Otp To Proceed!');
    }
    setIsLoading(true);
    await verifyOtp(token, value, phone, email, dispatch);
    setIsLoading(false);
  };

  const verifyPasswordOtpHandler = async () => {
    try {
      setIsLoading(true);
      const response = await verifyPasswordOtp(email, value);
      console.log('responnse', response);
      if (response.success) {
        ShowToast('success', response.message);
        navigation.navigate('ResetPassword', {email});
      } else {
        ShowToast('error', response.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };
  return (
    <BackgroundScreen stylesPorp={{justifyContent: 'space-between'}}>
      <View>
        <View style={{gap: 10}}>
          <AppText
            title={
              forgotPassword ? 'Email Verification' : 'Verify Your Identity'
            }
            textSize={3}
            textAlignment={'center'}
            textFontWeight
          />
          <AppText
            title={
              forgotPassword
                ? 'Please type OTP code that we give you'
                : `We’ve sent a 4-digit code to ${
                    email ? email : phone
                  } Please enter it below.`
            }
            textSize={1.9}
            textwidth={80}
            textAlignment={'center'}
            textColor={'#939393'}
          />
        </View>

        <CodeField
          ref={ref}
          value={value}
          onChangeText={setValue}
          cellCount={4}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.select({
            android: 'sms-otp',
            default: 'one-time-code',
          })}
          testID="my-code-input"
          renderCell={({index, symbol, isFocused}) => (
            <Text key={index} style={[styles.cell]}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
        {resendOtpLoading ? (
          <View style={{marginTop: responsiveHeight(5)}}>
            <ActivityIndicator size={'large'} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={forgotPassword ? forgotPasswordHandler : null}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              marginTop: 20,
            }}>
            <AppText
              title="Didn’t receive a code?"
              textSize={1.9}
              textAlignment={'center'}
              textColor={'#939393'}
            />
            <AppText
              title="Resend"
              textSize={1.9}
              textAlignment={'center'}
              textColor={AppColors.BLUE}
            />
          </TouchableOpacity>
        )}
      </View>

      <AppButton
        handlePress={
          forgotPassword ? verifyPasswordOtpHandler : handleOtpVerification
        }
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={AppColors.WHITE} />
          ) : forgotPassword ? (
            'Verify Email'
          ) : (
            'Continue'
          )
        }
        bgColor={AppColors.BTNCOLOURS}
      />
    </BackgroundScreen>
  );
};

export default Otp;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    width: responsiveWidth(70),
    alignSelf: 'center',
  },
  cell: {
    width: responsiveWidth(12),
    height: responsiveHeight(7),
    fontSize: responsiveFontSize(3),
    backgroundColor: AppColors.LIGHTGRAY,
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  focusCell: {
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
