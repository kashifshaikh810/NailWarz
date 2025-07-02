/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
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

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {token,userData} = useSelector(state => state.user);
  console.log('token', token);
  console.log('userData', userData);


  const loginHandler = async () => {
    setIsLoading(true);
    await userLogin(email, password, dispatch);
    setIsLoading(false);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1}}>
      <LinearGradient
        colors={[AppColors.WHITE, AppColors.BLACK]}
        style={{flex: 1, padding: 20}}>
        <View
          style={{
            height: responsiveHeight(10),
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}>
          <Logo logoUrl={APPImages.LOGO} />
        </View>

        <View style={{gap: 20}}>
          <Logo
            logoUrl={APPImages.LOGO}
            logoWeight={responsiveHeight(20)}
            logoHeight={responsiveHeight(20)}
            logoReizeMode={'contain'}
          />

          <View>
            <AppText
              title="Welcome to"
              textColor={AppColors.WHITE}
              textSize={3}
              textFontWeight={700}
            />
            <AppText
              title="Nail Warz"
              textColor={AppColors.WHITE}
              textSize={3.5}
              textFontWeight={700}
            />
          </View>

          <AppTextInput
            onChangeText={value => setEmail(value)}
            inputPlaceHolder={'Enter your email address'}
            containerBg={AppColors.INPUTBG}
          />
          <AppTextInput
            onChangeText={value => setPassword(value)}
            inputPlaceHolder={'Enter your pasword'}
            containerBg={AppColors.INPUTBG}
          />

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
              gap: 10,
            }}>
            <SocialAuthButton
              bgColor={AppColors.BLACK}
              title={'Continue with Apple'}
              logo={
                <AntDesign
                  name={'apple1'}
                  size={responsiveFontSize(2)}
                  color={AppColors.WHITE}
                />
              }
            />
            <SocialAuthButton
              txtColor={AppColors.BLACK}
              bgColor={AppColors.LIGHTGRAY}
              title={'Continue with Google'}
              logo={
                <AntDesign
                  name={'google'}
                  size={responsiveFontSize(2)}
                  color={AppColors.BLACK}
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
      </LinearGradient>
    </ScrollView>
  );
};

export default Login;
