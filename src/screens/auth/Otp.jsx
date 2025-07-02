import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
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
import {ShowToast, verifyOtp} from '../../GlobalFunctions/auth';
import {useDispatch} from 'react-redux';

const Otp = ({navigation, route}) => {
  const [value, setValue] = useState();
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {token} = route?.params;
  console.log('value', value);
  const handleOtpVerification = async () => {
    if (!value) {
      return ShowToast('error', 'Plz Enter Your Otp To Proceed!');
    }
    setIsLoading(true);
    await verifyOtp(token, value, dispatch);
    setIsLoading(false);
  };
  return (
    <BackgroundScreen stylesPorp={{justifyContent: 'space-between'}}>
      <View>
        <View style={{gap: 10}}>
          <AppText
            title="Verify Your Identity"
            textSize={3}
            textAlignment={'center'}
            textFontWeight
          />
          <AppText
            title="We’ve sent a 4-digit code to 071*****05 Please enter it below."
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

        <View
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
        </View>
      </View>

      <AppButton handlePress={handleOtpVerification}
          title={
            isLoading ? (
              <ActivityIndicator size={'large'} color={AppColors.WHITE} />
            ) : (
              'Continue'
            )
          } bgColor={AppColors.BTNCOLOURS} />
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
