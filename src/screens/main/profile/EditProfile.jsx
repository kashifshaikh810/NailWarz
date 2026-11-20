/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
import {editProfile, ShowToast} from '../../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {selectImage} from '../../../GlobalFunctions';
import {ImageBaseUrl, apiKey} from '../../../BaseUrl';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../../GlobalFunctions/styles';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {setLocation} from '../../../Redux/Slices';

const RequiredLabel = ({title}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <AppText title={title} textSize={1.9} textFontWeight={400} />
    <AppText
      title=" *"
      textSize={1.9}
      textColor={AppColors.BTNCOLOURS}
      textFontWeight={700}
    />
  </View>
);

const EditProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const {userData, location: latLng} = useSelector(state => state.user);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [phNumber, setPhNumber] = useState(userData?.phone || '');
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [city, setCity] = useState(userData?.city || '');
  const [state, setState] = useState(userData?.state || '');
  const [zipCode, setZipCode] = useState(userData?.zipCode || '');
  const [street, setStreet] = useState(userData?.street || '');
  const [addressText, setAddressText] = useState('');
  const [imageUri, setImageUri] = useState();
  const googlePlacesRef = useRef(null);
  const dispatch = useDispatch();

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select an Option',
      'Do recommendations want to upload an image or click one from the camera?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => selectImageHandler(true),
        },
        {
          text: 'Upload',
          onPress: () => selectImageHandler(false),
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

  // Helper function to extract address components from Google Places response
  const parseAddressComponents = (details, data) => {
    let streetNumber = '';
    let route = '';
    let locality = '';
    let adminArea = '';
    let postal = '';

    if (details?.address_components) {
      details.address_components.forEach(comp => {
        const types = comp.types || [];
        if (types.includes('street_number')) {
          streetNumber = comp.long_name;
        }
        if (types.includes('route')) {
          route = comp.long_name;
        }
        if (types.includes('locality')) {
          locality = comp.long_name;
        } else if (!locality && types.includes('sublocality')) {
          locality = comp.long_name;
        } else if (!locality && types.includes('neighborhood')) {
          locality = comp.long_name;
        } else if (!locality && types.includes('administrative_area_level_2')) {
          locality = comp.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          adminArea = comp.short_name || comp.long_name;
        }
        if (types.includes('postal_code')) {
          postal = comp.long_name;
        }
      });
    }

    const formatted = details?.formatted_address || data?.description || '';

    // Robust fallbacks if components are missing
    if (!locality && formatted) {
      const parts = formatted.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        locality = parts[parts.length - 3] || parts[1] || '';
      } else if (parts.length >= 2) {
        locality = parts[0] || '';
      }
    }
    if (!adminArea && formatted) {
      const parts = formatted.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        adminArea = parts[parts.length - 2] || parts[1] || '';
      }
    }

    const streetValue = streetNumber
      ? `${streetNumber} ${route}`.trim()
      : route || formatted.split(',')[0] || '';

    return {
      street: streetValue || formatted,
      city: locality || city || '',
      state: adminArea || state || '',
      zipCode: postal || zipCode || '',
      fullAddress: formatted,
    };
  };

  const editProfileHandler = async () => {
    Keyboard.dismiss();
    const trimmedFirstName = (firstName || '').trim();
    const trimmedLastName = (lastName || '').trim();
    const trimmedPhone = (phNumber ? String(phNumber) : '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedStreet = (street || '').trim();
    const trimmedCity = (city || '').trim();
    const trimmedState = (state || '').trim();
    const trimmedZipCode = (zipCode ? String(zipCode) : '').trim();

    if (!trimmedFirstName) {
      return ShowToast('error', 'Please enter your first name.');
    }
    if (trimmedFirstName.length < 2) {
      return ShowToast('error', 'First name must be at least 2 characters.');
    }

    if (!trimmedLastName) {
      return ShowToast('error', 'Please enter your last name.');
    }
    if (trimmedLastName.length < 2) {
      return ShowToast('error', 'Last name must be at least 2 characters.');
    }

    if (!trimmedPhone) {
      return ShowToast('error', 'Please enter your phone number.');
    }
    const cleanPhoneDigits = trimmedPhone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10) {
      return ShowToast('error', 'Please enter a valid 10-digit phone number.');
    }

    if (!trimmedEmail) {
      return ShowToast('error', 'Please enter your email.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return ShowToast('error', 'Please enter a valid email address.');
    }

    if (!trimmedStreet && !addressText) {
      return ShowToast('error', 'Please search and select your address.');
    }

    let finalStreet = trimmedStreet || addressText;
    let finalCity = trimmedCity;
    let finalState = trimmedState;
    let finalZipCode = trimmedZipCode;

    if (!finalCity || !finalState) {
      if (addressText) {
        const parts = addressText.split(',').map(s => s.trim());
        if (!finalCity) {
          finalCity = parts[1] || parts[0] || 'N/A';
        }
        if (!finalState) {
          finalState = parts[2] || parts[parts.length - 1] || 'N/A';
        }
      } else {
        if (!finalCity) {
          finalCity = 'N/A';
        }
        if (!finalState) {
          finalState = 'N/A';
        }
      }
    }

    const fullAddress =
      addressText ||
      [finalStreet, finalCity, finalState, finalZipCode]
        .filter(part => part && part !== 'N/A')
        .join(', ');

    const newLatitude = selectedCoords?.latitude || latLng?.latitude || null;
    const newLongitude = selectedCoords?.longitude || latLng?.longitude || null;

    dispatch(
      setLocation({
        latitude: newLatitude,
        longitude: newLongitude,
        address: fullAddress,
      }),
    );

    setIsLoading(true);
    await editProfile(
      userData._id,
      imageUri,
      navigation,
      dispatch,
      null,
      true,
      null,
      trimmedPhone,
      trimmedFirstName,
      trimmedLastName,
      trimmedEmail,
      finalCity,
      finalState,
      finalZipCode,
      finalStreet,
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

    const savedAddress = [
      userData?.street,
      userData?.city,
      userData?.state,
      userData?.zipCode,
    ]
      .filter(Boolean)
      .join(', ');

    if (savedAddress) {
      setAddressText(savedAddress);
      setTimeout(() => {
        googlePlacesRef.current?.setAddressText(savedAddress);
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title="Edit Profile" />
      <KeyboardAwareScrollView
        style={{flex: 1, paddingHorizontal: responsiveWidth(5)}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={180}
        extraHeight={180}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(15),
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
            <RequiredLabel title="First Name" />
            <AppTextInput
              value={firstName}
              onChangeText={value => setFirstName(value)}
              inputPlaceHolder="Enter your first name"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <RequiredLabel title="Last Name" />
            <AppTextInput
              value={lastName}
              onChangeText={value => setLastName(value)}
              inputPlaceHolder="Enter your last name"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <RequiredLabel title="Phone Number" />
            <AppTextInput
              keyboardType="phone-pad"
              value={phNumber}
              onChangeText={value => setPhNumber(value)}
              inputPlaceHolder="Enter your phone number (e.g. 555-123-4567)"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          <View style={{gap: responsiveHeight(1), width: '100%'}}>
            <RequiredLabel title="Email" />
            <AppTextInput
              value={email}
              onChangeText={value => setEmail(value)}
              inputPlaceHolder="Enter your email"
              keyboardType="email-address"
              containerBg={AppColors.INPUTBG}
            />
          </View>

          <LineBreak space={2} />
          {/* Address via GooglePlacesAutocomplete (Last Form Field) */}
          <View style={{gap: responsiveHeight(1), width: '100%', zIndex: 999}}>
            <RequiredLabel title="Address" />
            <GooglePlacesAutocomplete
              placeholder="Search your address"
              ref={googlePlacesRef}
              fetchDetails={true}
              debounce={400}
              minLength={2}
              enablePoweredByContainer={false}
              keyboardShouldPersistTaps="always"
              query={{
                key: apiKey,
                language: 'en',
              }}
              textInputProps={{
                placeholderTextColor: '#A0A0A0',
                clearButtonMode: 'never',
                autoCorrect: false,
                onChangeText: text => {
                  if (!text) {
                    setAddressText('');
                    setStreet('');
                    setCity('');
                    setState('');
                    setZipCode('');
                  }
                },
              }}
              renderLeftButton={() => (
                <View style={{justifyContent: 'center', paddingLeft: 12}}>
                  <Feather
                    name="map-pin"
                    size={responsiveFontSize(2.2)}
                    color={AppColors.BTNCOLOURS}
                  />
                </View>
              )}
              renderRightButton={() => (
                <TouchableOpacity
                  onPress={() => {
                    setAddressText('');
                    setStreet('');
                    setCity('');
                    setState('');
                    setZipCode('');
                    googlePlacesRef.current?.setAddressText('');
                  }}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 12,
                    paddingLeft: 6,
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#D1D5DB',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Feather name="x" size={12} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              )}
              renderRow={rowData => {
                const mainText =
                  rowData?.structured_formatting?.main_text ||
                  rowData?.description ||
                  '';
                const secondaryText =
                  rowData?.structured_formatting?.secondary_text || '';
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 4,
                    }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: '#FEE2E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="map-pin"
                        size={13}
                        color={AppColors.BTNCOLOURS}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <AppText
                        title={mainText}
                        textSize={1.7}
                        textFontWeight={600}
                        textColor={AppColors.BLACK}
                      />
                      {secondaryText ? (
                        <AppText
                          title={secondaryText}
                          textSize={1.35}
                          textColor="#6B7280"
                        />
                      ) : null}
                    </View>
                  </View>
                );
              }}
              onPress={(data, details = null) => {
                const selectedText =
                  data?.description || details?.formatted_address || '';
                if (details) {
                  const parsed = parseAddressComponents(details, data);
                  setStreet(parsed.street || selectedText);
                  setCity(parsed.city);
                  setState(parsed.state);
                  setZipCode(parsed.zipCode);
                  if (details?.geometry?.location) {
                    setSelectedCoords({
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    });
                  }
                } else if (selectedText) {
                  setStreet(selectedText);
                }
                setAddressText(selectedText);
                Keyboard.dismiss();
              }}
              styles={{
                container: {
                  flex: 0,
                  width: '100%',
                },
                textInputContainer: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: AppColors.INPUTBG,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: '#E2E8F0',
                },
                textInput: {
                  backgroundColor: 'transparent',
                  color: AppColors.BLACK,
                  fontSize: responsiveFontSize(1.8),
                  height: 50,
                  flex: 1,
                  paddingHorizontal: 10,
                },
                listView: {
                  backgroundColor: AppColors.WHITE,
                  borderRadius: 12,
                  marginTop: 6,
                  maxHeight: 220,
                  borderWidth: 1.5,
                  borderColor: '#E2E8F0',
                  elevation: 6,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 3},
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  overflow: 'hidden',
                },
                description: {
                  color: AppColors.BLACK,
                  fontSize: responsiveFontSize(1.7),
                },
                row: {
                  padding: 12,
                  backgroundColor: AppColors.WHITE,
                },
                separator: {
                  height: 1,
                  backgroundColor: '#F1F5F9',
                },
              }}
            />

            {/* Address Details Pills */}
            {city || state || zipCode ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 8,
                }}>
                {city ? (
                  <View
                    style={{
                      backgroundColor: '#EDEDED',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}>
                    <AppText
                      title={`City: ${city}`}
                      textSize={1.5}
                      textColor="#4A4A4A"
                    />
                  </View>
                ) : null}
                {state ? (
                  <View
                    style={{
                      backgroundColor: '#EDEDED',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}>
                    <AppText
                      title={`State: ${state}`}
                      textSize={1.5}
                      textColor="#4A4A4A"
                    />
                  </View>
                ) : null}
                {zipCode ? (
                  <View
                    style={{
                      backgroundColor: '#EDEDED',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}>
                    <AppText
                      title={`Zip: ${zipCode}`}
                      textSize={1.5}
                      textColor="#4A4A4A"
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
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
                  'Save'
                )
              }
              handlePress={editProfileHandler}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
