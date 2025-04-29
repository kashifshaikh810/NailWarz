import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const navigation = useNavigation();
  return (

      <LinearGradient  colors={[ AppColors.WHITE, AppColors.BLACK]} style={{flex:1, padding:20}} >
      <View
        style={{
          height: responsiveHeight(10),
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
        <Logo logoUrl={APPImages.LOGO} />

      </View>
    
      <View style={{gap: 20}}>


       <Logo logoUrl={APPImages.LOGO} logoWeight={responsiveHeight(20)} logoHeight={responsiveHeight(20)} logoReizeMode={'contain'}/>

        <View>
       <AppText title='Welcome to' textColor={AppColors.WHITE} textSize={3} textFontWeight={700}/>
       <AppText title='Nail Warz' textColor={AppColors.WHITE} textSize={3.5} textFontWeight={700}/>
        </View>

        <AppTextInput
        inputPlaceHolder={'Enter your email or phone number'}
        containerBg={AppColors.INPUTBG}
        
      />

        <AppButton handlePress={() => navigation.navigate('Main')} />

        <AppText title='Or' textAlignment={'center'} textSize={2} textColor={AppColors.WHITE}/>

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
      </View>
      </LinearGradient>

  );
};

export default Login;
