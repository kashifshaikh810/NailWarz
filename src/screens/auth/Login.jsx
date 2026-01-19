/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppText from '../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import BackgroundScreen from '../../components/AppTextComps/BackgroundScreen';
import AppTextInput from '../../components/AppTextInput';
import AppColors from '../../utils/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AppButton from '../../components/AppButton';
import SocialAuthButton from '../../components/SocialAuthButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Logo from '../../components/AppTextComps/Logo';
import APPImages from '../../assets/APPImages';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {
  ShowToast,
  signInWithGoogle,
  userLogin,
} from '../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SvgFromXml, SvgUri} from 'react-native-svg';
import {AppIcons} from '../../assets/Icons';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {setIsGoogleSignIn, setToken, setUserData} from '../../Redux/Slices';
import messaging from '@react-native-firebase/messaging';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState(null);
  const dispatch = useDispatch();
  const [secureTxtEntry, setSecureTxtEntry] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {token, userData, isLoading} = useSelector(state => state.user);
  const [withEmail, setWithEmail] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [fcmToken, setFcmToken] = useState();

  console.log('fcmToken', fcmToken);
  // GoogleSignin.configure({
  //   webClientId:
  //     '985993038096-pg0pmp2tdn6hpv9pij38arci06kpuc4p.apps.googleusercontent.com', // 👈 your Web clientId
  //   offlineAccess: true,
  // });
  GoogleSignin.configure({
    webClientId:
      '985993038096-pg0pmp2tdn6hpv9pij38arci06kpuc4p.apps.googleusercontent.com',
    offlineAccess: true,
  });
  useEffect(() => {
    const getToken = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const myfcmToken = await messaging().getToken();
          setFcmToken(myfcmToken);
          console.log('FCM Token:', fcmToken);
          // Alert.alert('FCM Token', fcmToken);
        } else {
          console.log('FCM permission not granted');
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    getToken();
  }, []);
  const loginHandler = async () => {
    await userLogin(email, password, phone, fcmToken, dispatch, navigation);
  };

  async function signInWithGoogleHandler() {
    if (isSigningIn) return; // prevent multiple calls
    setIsSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.type === 'success') {
        const {name} = userInfo.data.user;
        setGoogleLoading(true);
        const response = await signInWithGoogle(
          name,
          userInfo.data.user.email,
          fcmToken,
        );
        setGoogleLoading(false);

        if (response.success) {
          dispatch(setIsGoogleSignIn(true));
          dispatch(setToken(response.token));
          dispatch(setUserData(response.data));
        } else {
          ShowToast('error', response.message);
        }
      }
    } catch (error) {
      setGoogleLoading(false);
      ShowToast('error', error?.response?.data?.message);

      console.error('Google Sign-In Error:', error);
    } finally {
      setGoogleLoading(false);

      setIsSigningIn(false);
    }
  }
  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground source={APPImages.bg} style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, padding: 20}}>
          <View style={{gap: 20}}>
            <View
              style={{
                marginTop: responsiveHeight(2),
                // marginBottom: responsiveHeight(2),
              }}>
              <Image
                source={APPImages.LOGO}
                style={{
                  alignSelf: 'center',
                  height: responsiveHeight(17),
                  width: responsiveWidth(25),
                }}
                // resizeMode="contain"
              />
            </View>

            <View>
              <AppText
                title="Welcome to Nail Warz"
                textAlignment={'center'}
                textColor={AppColors.WHITE}
                textSize={3}
                textFontWeight={700}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: responsiveHeight(2),
              }}>
              <TouchableOpacity
                onPress={() => {
                  setWithEmail(true);
                  setEmail('');
                }}>
                <AppText
                  textSize={1.99}
                  textColor={withEmail ? AppColors.BTNCOLOURS : '#fff'}
                  title="Login with Email"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setWithEmail(false);
                  setPhone('');
                }}>
                <AppText
                  textColor={withEmail ? '#fff' : AppColors.BTNCOLOURS}
                  textSize={1.99}
                  title="Login with Phone"
                />
              </TouchableOpacity>
            </View>
            {withEmail ? (
              <View style={{gap: responsiveHeight(2)}}>
                <AppTextInput
                  keyboardType="email-address"
                  onChangeText={value => setEmail(value)}
                  inputPlaceHolder={'Enter your email address'}
                  containerBg={AppColors.INPUTBG}
                />
                <AppTextInput
                  showEye={true}
                  handleEyePress={() => setSecureTxtEntry(!secureTxtEntry)}
                  secureTxtEntry={secureTxtEntry}
                  onChangeText={value => setPassword(value)}
                  inputPlaceHolder={'Enter your pasword'}
                  containerBg={AppColors.INPUTBG}
                />
              </View>
            ) : (
              <AppTextInput
                keyboardType="numeric"
                onChangeText={value => setPhone(value)}
                inputPlaceHolder={'Enter your phone number'}
                containerBg={AppColors.INPUTBG}
              />
            )}
            <TouchableOpacity
              style={{alignSelf: 'flex-end', bottom: 5}}
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}>
              <AppText
                textSize={1.99}
                textColor={'#fff'}
                title="Forgot Password?"
              />
            </TouchableOpacity>
            <AppButton
              title={
                isLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Continue'
                )
              }
              handlePress={loginHandler}
            />

            <AppText
              title="Or"
              textAlignment={'center'}
              textSize={2}
              textColor={AppColors.WHITE}
            />

            <View
              style={{
                justifyContent: 'flex-end',
                gap: responsiveHeight(2.5),
              }}>
              <SocialAuthButton
                bgColor={AppColors.BLACK}
                title={'Continue with Apple'}
                logo={
                  <AntDesign
                    name={'apple1'}
                    size={responsiveFontSize(2.8)}
                    color={AppColors.WHITE}
                  />
                }
              />
              <SocialAuthButton
                onPress={signInWithGoogleHandler}
                txtColor={AppColors.BLACK}
                bgColor={AppColors.LIGHTGRAY}
                title={
                  googleLoading ? (
                    <ActivityIndicator
                      size={'large'}
                      color={AppColors.BTNCOLOURS}
                    />
                  ) : (
                    'Continue with Google'
                  )
                }
                logo={
                  !googleLoading && (
                    <SvgFromXml
                      xml={AppIcons.google}
                      height={responsiveFontSize(2.8)}
                      width={responsiveFontSize(2.8)}
                      // name={'google'}
                      // size={responsiveFontSize(2)}
                      // color={AppColors.BLACK}
                    />
                  )
                }
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveHeight(1),
                alignSelf: 'center',
              }}>
              <AppText
                title="Don't Have An Account?"
                textColor={AppColors.WHITE}
                textSize={2}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <AppText
                  title="Register"
                  textColor={AppColors.BTNCOLOURS}
                  textSize={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;
