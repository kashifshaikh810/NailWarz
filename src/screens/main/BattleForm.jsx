/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import AppColors from '../../utils/AppColors';
import {globalStyles} from '../../GlobalFunctions/styles';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import AppTextInput from '../../components/AppTextInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import PickerCard from '../../components/PickerCard';
import LineBreak from '../../components/LineBreak';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../../components/AppButton';
import SVGXml from '../../components/SVGXML';
import {AppIcons} from '../../assets/Icons';
import {selectImage} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';

const BattleForm = ({navigation}) => {
  const {userData} = useSelector(state => state?.user);
  const [value, setValue] = useState();
  const [platformValue, setPlatformValue] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setusername] = useState(userData?.username);
  const [email, setEmail] = useState(userData?.email);
  console.log('userdata', userData);

  const [type, setType] = useState([
    {label: 'Nail Salon', value: 'Salon'},
    {label: 'Nailee', value: 'Nailee'},
  ]);
  const [mediaHandle, setMediaHandle] = useState([
    {label: 'Instagram', value: 'Instagram'},
    {label: 'Facebook', value: 'Facebook'},
    {label: 'Twitter', value: 'Twitter'},
  ]);
  console.log('user', userData);
  const selectImageHandler = async () => {
    const response = await selectImage();
    setImageUri(response);
  };
  const SubmitFormHandler = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      ShowToast('success', 'Form Submitted Successfully');
      navigation.goBack();
    }, 1000);
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: AppColors.WHITE,
          paddingBottom: responsiveHeight(4.5),
        }}>
        <AppHeader title="Battle Form" onPress={() => navigation.goBack()} />
        <View
          style={{
            padding: responsiveHeight(2),
            paddingTop: responsiveHeight(0),
          }}>
          <AppText
            textSize={1.9}
            textColor={AppColors.RED}
            title="Compete For Nail Champion and get your
          next manicure FREE on us!"
            styles={{fontWeight: '500'}}
          />
          <AppText
            textSize={1.8}
            mrgnTop={2}
            title="Add an image of your nail services and verify you info below A winner will be chosen"
            styles={{fontWeight: '500'}}
          />
          <View
            style={{gap: responsiveHeight(2), marginTop: responsiveHeight(2)}}>
            <AppTextInput
              // onChangeText={value => setEmail(value)}
              inputPlaceHolder={'Amanda Jane'}
              value={username}
              onChangeText={value => setusername(value)}
              label="Full Name"
              containerBg={AppColors.INPUTBG}
              logo={
                <FontAwesome
                  name={'user-o'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
            <AppTextInput
              // onChangeText={value => setEmail(value)}
              inputPlaceHolder={'ananda@gmail.com'}
              label="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              containerBg={AppColors.INPUTBG}
              logo={
                <Fontisto
                  name={'email'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
            <View style={{zIndex: 3000, elevation: 3000}}>
              <AppText textFontWeight textSize={1.8} title="Select Your Type" />
              <LineBreak space={1} />
              <PickerCard
                bgColor={AppColors.INPUTBG}
                height={6}
                top={6}
                padding={0.001}
                dropDownBgColor={AppColors.INPUTBG}
                value={value}
                setValue={setValue}
                items={type}
                placeHolder="Type"
                zIndex={3000}
                dropDownZIndex={3001}
              />
            </View>
            <AppTextInput
              // onChangeText={value => setEmail(value)}
              inputPlaceHolder={'+123 456 789'}
              label="Phone"
              containerBg={AppColors.INPUTBG}
              logo={
                <Ionicons
                  name={'call-outline'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
            <AppTextInput
              // onChangeText={value => setEmail(value)}
              inputPlaceHolder={'123 Royal Street'}
              label="Address"
              containerBg={AppColors.INPUTBG}
              logo={
                <Ionicons
                  name={'location-outline'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveWidth(4),
              }}>
              <AppTextInput
                containerWidth={44.1}
                // onChangeText={value => setEmail(value)}
                inputPlaceHolder={'Newyork'}
                label="City"
                containerBg={AppColors.INPUTBG}
                logo={
                  <Ionicons
                    name={'location-outline'}
                    color={AppColors.BTNCOLOURS}
                    size={responsiveFontSize(2.5)}
                  />
                }
              />
              <AppTextInput
                containerWidth={44.1}
                // onChangeText={value => setEmail(value)}
                inputPlaceHolder={'Newyork'}
                label="State"
                containerBg={AppColors.INPUTBG}
                logo={
                  <Ionicons
                    name={'location-outline'}
                    color={AppColors.BTNCOLOURS}
                    size={responsiveFontSize(2.5)}
                  />
                }
              />
            </View>

            {imageUri ? (
              <View
                style={{
                  width: responsiveWidth(30),
                  marginTop: responsiveHeight(1),
                }}>
                <TouchableOpacity
                  onPress={() => setImageUri('')}
                  style={{
                    position: 'absolute',
                    backgroundColor: AppColors.BTNCOLOURS,
                    borderRadius: responsiveHeight(2),
                    top: responsiveHeight(1),
                    right: responsiveHeight(1),
                    zIndex: 100,
                  }}>
                  <Entypo name="cross" color={AppColors.WHITE} size={35} />
                </TouchableOpacity>
                <Image
                  source={{uri: imageUri}}
                  style={{
                    height: responsiveHeight(20),
                    borderRadius: responsiveHeight(1),
                    width: responsiveWidth(30),
                  }}
                />
              </View>
            ) : null}
            <TouchableOpacity
              onPress={selectImageHandler}
              style={{
                borderWidth: 1.5,
                borderColor: AppColors.BTNCOLOURS,
                backgroundColor: '#FDF2F2',
                borderRadius: responsiveHeight(2),
                borderStyle: 'dashed',
                padding: responsiveHeight(5),
                alignItems: 'center',
              }}>
              <SVGXml icon={AppIcons.addImage} height={50} width={50} />
              <AppText
                mrgnTop={1}
                textSize={1.9}
                title="Add nail Service image"
                textColor="#A0A0A0"
              />
            </TouchableOpacity>

            <View style={{zIndex: 2000, elevation: 2000}}>
              <AppText textFontWeight textSize={1.8} title="Select Platform" />
              <LineBreak space={1} />
              <PickerCard
                bgColor={AppColors.INPUTBG}
                height={6}
                top={6}
                padding={0.001}
                dropDownBgColor={AppColors.INPUTBG}
                value={platformValue}
                setValue={setPlatformValue}
                items={mediaHandle}
                placeHolder="Select Social Media Platform"
                zIndex={2000}
                dropDownZIndex={2001}
              />
            </View>
            <AppTextInput
              // onChangeText={value => setEmail(value)}
              inputPlaceHolder={'@username'}
              label="Social Media Handle"
              containerBg={AppColors.INPUTBG}
              logo={
                <FontAwesome
                  name={'user-o'}
                  color={AppColors.BTNCOLOURS}
                  size={responsiveFontSize(2.5)}
                />
              }
            />
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(2),
                marginTop: responsiveHeight(1),
              }}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={{
                  backgroundColor: isChecked
                    ? AppColors.BTNCOLOURS
                    : AppColors.WHITE,
                  borderWidth: 2,
                  height: responsiveHeight(3.5),
                  width: responsiveWidth(7),
                  borderColor: AppColors.BTNCOLOURS,
                  borderRadius: responsiveHeight(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {isChecked && (
                  <Ionicons
                    name="checkmark-sharp"
                    color={AppColors.WHITE}
                    size={23}
                  />
                )}
              </TouchableOpacity>
              <AppText
                textwidth={80}
                textSize={1.75}
                textColor="#A0A0A0"
                styles={{fontWeight: '500'}}
                title="By Checking this box , I confirm that i am following Nail Warz on Social Media"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsChecked2(!isChecked2)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(2),
                marginTop: responsiveHeight(0.5),
              }}>
              <TouchableOpacity
                onPress={() => setIsChecked2(!isChecked2)}
                style={{
                  backgroundColor: isChecked2
                    ? AppColors.BTNCOLOURS
                    : AppColors.WHITE,
                  borderWidth: 2,
                  height: responsiveHeight(3.5),
                  width: responsiveWidth(7),
                  borderColor: AppColors.BTNCOLOURS,
                  borderRadius: responsiveHeight(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {isChecked2 && (
                  <Ionicons
                    name="checkmark-sharp"
                    color={AppColors.WHITE}
                    size={23}
                  />
                )}
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.75),
                    width: responsiveWidth(80),
                    color: '#A0A0A0',
                    fontWeight: '500',
                  }}>
                  By Checking this box , I confirm that i am following{' '}
                  <Text style={{textDecorationLine: 'underline'}}>
                    Nail Warz Terms & Conditions
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
            <LineBreak space={2} />

            <AppButton
              handlePress={SubmitFormHandler}
              title={
                isLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Submit'
                )
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BattleForm;
