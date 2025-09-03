/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
import {registerUser, ShowToast} from '../../GlobalFunctions/auth';
import {useNavigation} from '@react-navigation/native';
import APPImages from '../../assets/APPImages';
import {SvgFromXml} from 'react-native-svg';
import {AppIcons} from '../../assets/Icons';
const Signup = ({navigation}) => {
  const [form, setForm] = useState({
    userName: '',
    email: null,
    phone: null,
    password: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [withEmail, setWithEmail] = useState(true);
  const [secureTxtEntry, setSecureTxtEntry] = useState(true);
  console.log('form', form);
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}));
  };
  const handleRegisteration = async () => {
    const {userName, email, password, phone} = form;
    // if (!withEmail) {
    //   return ShowToast('error', 'This Feature Is Under Development');
    // }
    // if (!userName && !email && !password) {
    //   return ShowToast('error', 'Plz Provide Complete Details To Proceed!');
    // }
    if (!isChecked) {
      return ShowToast('error', 'You Must Agree To Terms & Conditions');
    }
    setIsLoading(true);
    try {
      await registerUser(userName, email, password, phone, navigation);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      return ShowToast('error', error?.response?.data?.message);
    }
  };
  console.log('form', form);
  return (
    <BackgroundScreen padding={0.1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          // marginTop:responsiveHeight(1.5),
          paddingBottom: responsiveHeight(2),
        }}>
        <View
          style={
            {
              // top:20,
            }
          }>
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
        <View
          style={{
            // height: responsiveHeight(10),
            // backgroundColor:'red',
            justifyContent: 'flex-end',
            bottom: 25,
            // marginBottom: 20,
          }}>
          <AppText
            textSize={2.8}
            title={'Signup'}
            textAlignment={'center'}
            textFontWeight
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
              handleInputChange('phone', null);
            }}>
            <AppText
              textSize={1.99}
              textColor={withEmail ? '#C11210' : '#000'}
              title="Signup with email"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setWithEmail(false);
              handleInputChange('email', null);
            }}>
            <AppText
              textColor={withEmail ? '#000' : '#C11210'}
              textSize={1.99}
              title="Signup with phone"
            />
          </TouchableOpacity>
        </View>

        <View style={{gap: 20, marginTop: responsiveHeight(2), flex: 1}}>
          <AppTextInput
            onChangeText={value => handleInputChange('userName', value)}
            inputPlaceHolder={'Username'}
            containerBg={AppColors.INPUTBG}
            logo={
              <Ionicons
                name={'person-outline'}
                color={AppColors.BTNCOLOURS}
                size={responsiveFontSize(2.5)}
              />
            }
          />
          {withEmail && (
            <AppTextInput
              keyboardType={'email-address'}
              onChangeText={value => handleInputChange('email', value)}
              inputPlaceHolder={'Email'}
              containerBg={AppColors.INPUTBG}
              logo={
                <Feather
                  name={'mail'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
          )}
          {!withEmail && (
            <AppTextInput
              keyboardType={'numeric'}
              onChangeText={value => handleInputChange('phone', value)}
              inputPlaceHolder={'Phone Number'}
              containerBg={AppColors.INPUTBG}
              logo={
                <Feather
                  name={'phone'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
          )}
          {withEmail ? (
            <AppTextInput
              showEye={true}
              handleEyePress={() => setSecureTxtEntry(!secureTxtEntry)}
              secureTxtEntry={secureTxtEntry}
              onChangeText={value => handleInputChange('password', value)}
              inputPlaceHolder={'Password'}
              containerBg={AppColors.INPUTBG}
              logo={<SvgFromXml xml={AppIcons.key} />}
            />
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              marginTop: withEmail ? responsiveHeight(4) : responsiveHeight(10),
            }}>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={{
                height: responsiveHeight(3),
                width: responsiveHeight(3),
                backgroundColor: AppColors.LIGHTGRAY,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isChecked && (
                <Ionicons
                  name="checkmark-sharp"
                  size={20}
                  color={AppColors.BLACK}
                />
              )}
            </TouchableOpacity>
            <AppText
              textSize={2}
              title="I agree to Nail Warz Terms of Service
                and Privacy Policy"
              textFontWeight={100}
            />
          </View>
          <AppButton
            handlePress={handleRegisteration}
            title={
              isLoading ? (
                <ActivityIndicator size={'large'} color={AppColors.WHITE} />
              ) : (
                'Continue'
              )
            }
          />

          <View
            style={{
              flex: 1,
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
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveHeight(1),
                alignSelf: 'center',
              }}>
              <AppText
                title="Already Have An Account?"
                textColor={AppColors.BLACK}
                textSize={2}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <AppText
                  title="Login"
                  textColor={AppColors.BTNCOLOURS}
                  textSize={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </BackgroundScreen>
  );
};

export default Signup;
