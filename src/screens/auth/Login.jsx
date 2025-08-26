/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
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
import {userLogin} from '../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SvgFromXml, SvgUri} from 'react-native-svg';
import {AppIcons} from '../../assets/Icons';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState(null);
  const dispatch = useDispatch();
  const [secureTxtEntry, setSecureTxtEntry] = useState(true);
  const {token, userData, isLoading} = useSelector(state => state.user);
  const [withEmail, setWithEmail] = useState(true);

  console.log('userData', userData);

  const loginHandler = async () => {
    await userLogin(email, password, phone, dispatch, navigation);
  };
  return (
    <ImageBackground source={APPImages.bg} style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, padding: 20}}>
        <View style={{gap: 20}}>
          <View
            style={{
              marginTop: responsiveHeight(3),
              marginBottom: responsiveHeight(2),
            }}>
            <Image
              source={APPImages.logoSmall}
              style={{
                alignSelf: 'flex-end',
                height: responsiveHeight(10),
                width: responsiveWidth(15),
              }}
              resizeMode="contain"
            />
          </View>

          <View>
            <AppText
              title="Welcome"
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
                title="Login with email"
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
                title="Login with phone"
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
              txtColor={AppColors.BLACK}
              bgColor={AppColors.LIGHTGRAY}
              title={'Continue with Google'}
              logo={
                <SvgFromXml
                  xml={AppIcons.google}
                  height={responsiveFontSize(2.8)}
                  width={responsiveFontSize(2.8)}
                  // name={'google'}
                  // size={responsiveFontSize(2)}
                  // color={AppColors.BLACK}
                />
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
  );
};

export default Login;
