/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
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

const EditProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState();
  const [imageUri, setImageUri] = useState();
  const {userData} = useSelector(state => state.user);
  const dispatch = useDispatch();
  // console.log('_id', _id);

  const selectImageHandler = async () => {
    const response = await selectImage();
    setImageUri(response);
  };
  const editProfileHandler = async () => {
    setIsLoading(true);
    await editProfile(
      userData._id,
      userName,
      imageUri,
      navigation,
      dispatch,
      null,
      true,
    );
    setIsLoading(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title="Edit Profile" />

      <View style={{paddingHorizontal: responsiveWidth(5)}}>
        <View style={{alignItems: 'center'}}>
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
                onPress={selectImageHandler}
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

          <View style={{gap: responsiveHeight(1)}}>
            <AppText title="User Name" textSize={1.9} textFontWeight={400} />
            <AppTextInput
              onChangeText={value => setUserName(value)}
              inputPlaceHolder={'Charles James'}
              containerBg={AppColors.INPUTBG}
            />
            {/* <LineBreak space={2} />

            <AppTextInput
              inputPlaceHolder={'charlesjames988@gmail.com'}
              containerBg={AppColors.INPUTBG}
            />

            <LineBreak space={2} />

            <AppTextInput
              inputPlaceHolder={'+123 456 7890'}
              containerBg={AppColors.INPUTBG}
            /> */}
          </View>
          <View
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              marginTop: responsiveHeight(7),
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
      </View>
    </View>
  );
};

export default EditProfile;
