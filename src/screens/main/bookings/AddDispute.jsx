/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import LineBreak from '../../../components/LineBreak';
import {globalStyles} from '../../../GlobalFunctions/styles';
import {selectImage, createDispute} from '../../../GlobalFunctions';
import {ShowToast} from '../../../GlobalFunctions/auth';
import {useSelector} from 'react-redux';
import {ImageBaseUrl} from '../../../BaseUrl';
import moment from 'moment';
import SVGXml from '../../../components/SVGXML';
import {AppIcons} from '../../../assets/Icons';
import Entypo from 'react-native-vector-icons/Entypo';

const AddDispute = ({route}) => {
  const navigation = useNavigation();
  const {bookingData} = route?.params || {};
  const {token} = useSelector(state => state.user);
  const [form, setForm] = useState({
    reason: '',
    description: '',
    attachedImages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const selectImageHandler = async () => {
    const response = await selectImage();
    if (response) {
      setForm(prev => ({
        ...prev,
        attachedImages: [...prev.attachedImages, response],
      }));
    }
  };

  const removeImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      attachedImages: prev.attachedImages.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = () => {
    if (!form.reason.trim()) {
      ShowToast('error', 'Please enter a dispute reason');
      return false;
    }
    if (!form.description.trim()) {
      ShowToast('error', 'Please describe the issue');
      return false;
    }
    return true;
  };

  const submitDisputeHandler = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await createDispute(
        bookingData?._id,
        form.reason,
        form.description,
        form.attachedImages,
        token
      );

      if (response?.success) {
        ShowToast('success', 'Dispute submitted successfully');
        navigation.goBack();
      } else {
        ShowToast('error', response?.message || 'Failed to submit dispute');
      }
    } catch (error) {
      console.log('Dispute submission error:', error);
      ShowToast('error', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: responsiveHeight(15),
            backgroundColor: AppColors.WHITE,
          }}>
        <View>
          <AppHeader
            isLogo
            style={{paddingBottom: responsiveHeight(2)}}
            onPress={() => navigation.goBack()}
            title="Submit Dispute"
          />
          
          <View style={{padding: responsiveHeight(2)}}>
            {/* Booking Info Card */}
            <View style={{
              backgroundColor: AppColors.WHITE,
              borderRadius: 10,
              padding: responsiveHeight(2),
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.1,
              shadowRadius: 3,
              marginBottom: responsiveHeight(3),
            }}>
              <AppText
                title="Booking Details"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
                marginBottom={responsiveHeight(1)}
              />
              
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: `${ImageBaseUrl}${bookingData?.salonId?.image?.[0]}`}}
                  style={{
                    height: responsiveHeight(8),
                    width: responsiveHeight(8),
                    borderRadius: 8,
                    marginRight: responsiveWidth(3),
                  }}
                />
                <View style={{flex: 1}}>
                  <AppText
                    title={bookingData?.salonId?.salonName}
                    textSize={2}
                    textColor={AppColors.BLACK}
                    textFontWeight
                  />
                  <AppText
                    title={bookingData?.salonId?.location?.locationName}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    mrgnTop={0.5}
                  />
                  <AppText
                    title={`${moment(bookingData?.date, 'DD-MM-YYYY').format('MMM DD, YYYY')} - ${bookingData?.time}`}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    mrgnTop={0.5}
                  />
                  <AppText
                    title={`Service: ${bookingData?.serviceId?.serviceName}`}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    mrgnTop={0.5}
                  />
                </View>
              </View>
            </View>

            {/* Dispute Reason Input */}
            <View style={{marginTop: responsiveHeight(2)}}>
              <AppTextInput
                label="Dispute Reason *"
                inputPlaceHolder="Enter the reason for your dispute..."
                onChangeText={value => handleInputChange('reason', value)}
                value={form.reason}
                containerBg={AppColors.INPUTBG}
              />
            </View>

            <LineBreak space={2} />

            {/* Description Input */}
            <AppTextInput
              label="Describe the Issue *"
              inputPlaceHolder="Please provide detailed information about the issue..."
              multiline={true}
              height={14}
              onChangeText={value => handleInputChange('description', value)}
              value={form.description}
              containerBg={AppColors.INPUTBG}
              txtAlignVertical="top"
            />

            <LineBreak space={2} />

            {/* Image Attachments */}
            <AppText
              title="Attach Evidence (Optional)"
              textSize={2.2}
              textColor={AppColors.BLACK}
              textFontWeight
            />
            <LineBreak space={1} />

            {/* Add Image Button */}
            <TouchableOpacity
              onPress={selectImageHandler}
              style={{
                borderWidth: 1.5,
                borderColor: AppColors.BTNCOLOURS,
                backgroundColor: '#FDF2F2',
                borderRadius: responsiveHeight(2),
                borderStyle: 'dashed',
                padding: responsiveHeight(4),
                alignItems: 'center',
                marginBottom: responsiveHeight(2),
              }}>
              <SVGXml icon={AppIcons.addImage} height={40} width={40} />
              <AppText
                mrgnTop={1}
                textSize={1.8}
                title="Add dispute evidence"
                textColor="#A0A0A0"
              />
            </TouchableOpacity>

            {/* Display Selected Images */}
            {form.attachedImages.length > 0 && (
              <FlatList
                data={form.attachedImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10, paddingBottom: responsiveHeight(2)}}
                renderItem={({item, index}) => (
                  <View style={{position: 'relative'}}>
                    <Image
                      source={{uri: item}}
                      style={{
                        width: responsiveWidth(25),
                        height: responsiveWidth(25),
                        borderRadius: 8,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        backgroundColor: AppColors.BTNCOLOURS,
                        borderRadius: 15,
                        width: 25,
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Entypo name="cross" color={AppColors.WHITE} size={15} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            <LineBreak space={4} />

            {/* Submit Button */}
            <AppButton
              title={isLoading ? (
                <ActivityIndicator size="small" color={AppColors.WHITE} />
              ) : (
                'Submit Dispute'
              )}
              handlePress={submitDisputeHandler}
              disabled={isLoading}
              bgColor={AppColors.BTNCOLOURS}
              textColor={AppColors.WHITE}
            />
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddDispute;
