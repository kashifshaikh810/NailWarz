/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import APPImages from '../../../assets/APPImages';
import Feather from 'react-native-vector-icons/Feather';
import LineBreak from '../../../components/LineBreak';
import AppTextInput from '../../../components/AppTextInput';
import AppText from '../../../components/AppTextComps/AppText';
import AppButton from '../../../components/AppButton';
import {editProfile} from '../../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {selectImage} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../../GlobalFunctions/styles';

const EditProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {userData} = useSelector(state => state.user);
  const [phNumber, setPhNumber] = useState(userData?.phone || null);
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [city, setCity] = useState(userData?.city || '');
  const [state, setState] = useState(userData?.state || '');
  const [zipCode, setZipCode] = useState(userData?.zipCode || '');
  const [street, setStreet] = useState(userData?.street || '');
  const [imageUri, setImageUri] = useState();
  const dispatch = useDispatch();
  // console.log('_id', _id);
  const showImagePickerOptions = () => {
    Alert.alert(
      'Select an Option',
      'Do you want to upload an image or click one from the camera?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => selectImageHandler(true), // true → camera
        },
        {
          text: 'Upload',
          onPress: () => selectImageHandler(false), // false → gallery
        },
      ],
      {cancelable: true},
    );
  };
  const selectImageHandler = async (fromCamera = false) => {
    const response = await selectImage(fromCamera ? 'camera' : 'gallery');
    if (response) {
      setImageUri(response);
    }
  };
  const editProfileHandler = async () => {
    setIsLoading(true);
    await editProfile(
      userData._id,
      imageUri,
      navigation,
      dispatch,
      null,
      true,
      null,
      phNumber,
      firstName,
      lastName,
      email,
      city,
      state,
      zipCode,
      street,
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (userData?.phone) {
      setPhNumber(String(userData.phone));
    }
    setFirstName(userData?.firstName || '');
    setLastName(userData?.lastName || '');
    setEmail(userData?.email || '');
    setCity(userData?.city || '');
    setState(userData?.state || '');
    setZipCode(userData?.zipCode || '');
    setStreet(userData?.street || '');
  }, [userData]);
  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title="Edit Profile" />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? responsiveHeight(5) : 0}>
        <ScrollView
          style={{flex: 1, paddingHorizontal: responsiveWidth(5)}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingBottom: responsiveHeight(5),
          }}>
          <View style={{alignItems: 'center', width: '100%'}}>
          <View
            style={{
              borderWidth: 2,
              width: 110,
              height: 110,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
                  : userData?.image
                  ? {uri: `${ImageBaseUrl}${userData?.image}`}
                  : APPImages.dummyImg
              }
              style={{width: 100, height: 100, borderRadius: 100}}
            />
            <View style={{position: 'absolute', bottom: 0, right: 0}}>
              <TouchableOpacity
                onPress={showImagePickerOptions}
                style={{
                  backgroundColor: AppColors.BLACK,
                  padding: 8,
                  borderRadius: 100,
                }}
                activeOpacity={0.7}>
                <Feather
                  name={'camera'}
                  size={responsiveFontSize(1.6)}
                  color={AppColors.WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>

          <LineBreak space={7} />

          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="First Name" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={firstName}
              onChangeText={value => setFirstName(value)}
              inputPlaceHolder="Enter your first name"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="Last Name" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={lastName}
              onChangeText={value => setLastName(value)}
              inputPlaceHolder="Enter your last name"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="Phone Number" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              keyboardType="numeric"
              value={phNumber}
              onChangeText={value => setPhNumber(value)}
              inputPlaceHolder="Enter your phone number"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="Email" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={email}
              onChangeText={value => setEmail(value)}
              inputPlaceHolder="Enter your email"
              keyboardType="email-address"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="Street" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={street}
              onChangeText={value => setStreet(value)}
              inputPlaceHolder="Enter your street address"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="City" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={city}
              onChangeText={value => setCity(value)}
              inputPlaceHolder="Enter your city"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="State" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={state}
              onChangeText={value => setState(value)}
              inputPlaceHolder="Enter your state"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <AppText title="Zip Code" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              value={zipCode}
              onChangeText={value => setZipCode(value)}
              inputPlaceHolder="Enter your zip code"
              keyboardType="numeric"
              containerBg={AppColors.INPUTBG}
            />
          </View>
          <View
            style={{
              width: '100%',
              marginTop: responsiveHeight(5),
              marginBottom: responsiveHeight(3),
            }}>
            <AppButton
              title={
                isLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Edit'
                )
              }
              handlePress={editProfileHandler}
            />
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
