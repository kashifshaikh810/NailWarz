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

const DISPUTE_CATEGORIES = [
  {label: 'Service Quality Issue', value: 'Service_Quality'},
  {label: 'Wrong Service Performed', value: 'Wrong_Service'},
  {label: 'Vendor No-Show / Absence', value: 'Vendor_No_Show'},
  {label: 'Hygiene or Sanitation Concern', value: 'Hygiene_Sanitation'},
  {label: 'Damage or Injury Concern', value: 'Damage_Injury'},
  {label: 'Other', value: 'Other'},
];

const REQUESTED_OUTCOMES = [
  {label: 'Request Nail Warz Wallet Credit', value: 'Platform_Credit'},
  {label: 'Request Vendor Follow-Up', value: 'Vendor_Follow_Up'},
  {label: 'Report Issue Only', value: 'Report_Only'},
  {label: 'Other', value: 'Other'},
];

const CONFIRMATION_TEXT =
  'I understand that submitting a dispute does not guarantee a credit, refund, adjustment, or vendor penalty. Nail Warz will review the information provided and determine any resolution in accordance with its policies.';

const SUCCESS_MESSAGE =
  'Your dispute has been submitted for review. Nail Warz will review the booking details, supporting information, and applicable platform policies. Submitting a dispute does not guarantee a credit, refund, adjustment, or vendor action. Reviews are typically completed within 5-10 business days.';

const flattenBookingValue = value => {
  if (Array.isArray(value)) {
    return value.reduce(
      (items, item) => [...items, ...flattenBookingValue(item)],
      [],
    );
  }

  return value ? [value] : [];
};

const getBookingServices = booking => {
  const newServices = flattenBookingValue(booking?.servicesDetail)
    .map(detail => {
      if (!detail || typeof detail !== 'object') {
        return null;
      }

      return {
        ...detail,
        serviceName: detail?.serviceName || detail?.service?.serviceName,
        scheduledAt: detail?.scheduledAt,
      };
    })
    .filter(Boolean);

  if (newServices.length) {
    return newServices;
  }

  return flattenBookingValue(booking?.serviceId).filter(
    service => service && typeof service === 'object',
  );
};

const getFallbackBookingDateLabel = booking => {
  const fallbackMoment = booking?.date
    ? moment(
        booking?.time ? `${booking.date} ${booking.time}` : booking.date,
        [
          moment.ISO_8601,
          'DD-MM-YYYY hh:mm A',
          'DD-MM-YYYY HH:mm',
          'DD-MM-YYYY',
          'YYYY-MM-DD',
        ],
        true,
      )
    : null;

  if (fallbackMoment?.isValid()) {
    return booking?.time
      ? fallbackMoment.format('MMM DD, YYYY - h:mm A')
      : fallbackMoment.format('MMM DD, YYYY');
  }

  return 'Date not available';
};

const getBookingServiceRows = booking => {
  const fallbackDateLabel = getFallbackBookingDateLabel(booking);
  const services = getBookingServices(booking);

  if (!services.length) {
    return [`Service not available • ${fallbackDateLabel}`];
  }

  return services.map(service => {
    const scheduledMoment = service?.scheduledAt
      ? moment(service.scheduledAt)
      : null;
    const dateLabel = scheduledMoment?.isValid()
      ? scheduledMoment.format('MMM DD, YYYY - h:mm A')
      : fallbackDateLabel;

    return `${service?.serviceName || 'Service'} • ${dateLabel}`;
  });
};

const OptionGroup = ({title, options, selectedValue, onSelect, optional}) => {
  return (
    <View>
      <AppText
        title={`${title}${optional ? '' : ' *'}`}
        textSize={1.8}
        textColor={AppColors.BLACK}
        textFontWeight
      />
      <LineBreak space={1} />
      <View style={{gap: responsiveHeight(1)}}>
        {options.map(option => {
          const isSelected = selectedValue === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.85}
              onPress={() => onSelect(option.value)}
              style={{
                borderWidth: 1,
                borderColor: isSelected ? AppColors.BTNCOLOURS : '#E4E4E4',
                backgroundColor: isSelected ? '#FFF1F1' : AppColors.WHITE,
                borderRadius: 10,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(1.5),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <AppText
                title={option.label}
                textSize={1.8}
                textColor={isSelected ? AppColors.BTNCOLOURS : AppColors.BLACK}
                textFontWeight={isSelected}
              />
              <View
                style={{
                  width: responsiveHeight(2.2),
                  height: responsiveHeight(2.2),
                  borderRadius: responsiveHeight(1.1),
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? AppColors.BTNCOLOURS
                    : AppColors.DARKGRAY,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {isSelected && (
                  <View
                    style={{
                      width: responsiveHeight(1.1),
                      height: responsiveHeight(1.1),
                      borderRadius: responsiveHeight(0.55),
                      backgroundColor: AppColors.BTNCOLOURS,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const AddDispute = ({route}) => {
  const navigation = useNavigation();
  const {bookingData} = route?.params || {};
  const {token} = useSelector(state => state.user);
  const [form, setForm] = useState({
    category: '',
    otherCategoryExplanation: '',
    requestedOutcome: '',
    requestedOutcomeOtherExplanation: '',
    description: '',
    attachedImages: [],
    confirmationAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const bookingServiceRows = getBookingServiceRows(bookingData);
  const handleInputChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const buildDisputePayload = nextForm => {
    return {
      appointmentId: bookingData?._id,
      raisedBy: 'User',
      category: nextForm.category,
      description: nextForm.description.trim(),
      otherCategoryExplanation:
        nextForm.category === 'Other'
          ? nextForm.otherCategoryExplanation.trim()
          : undefined,
      requestedOutcome: nextForm.requestedOutcome || undefined,
      requestedOutcomeOtherExplanation:
        nextForm.requestedOutcome === 'Other'
          ? nextForm.requestedOutcomeOtherExplanation.trim()
          : undefined,
      images: nextForm.attachedImages,
    };
  };

  const handleConfirmationToggle = () => {
    setForm(prev => {
      const nextForm = {
        ...prev,
        confirmationAccepted: !prev.confirmationAccepted,
      };

      if (nextForm.confirmationAccepted) {
        console.log(
          'Create dispute API body preview after checkbox:',
          buildDisputePayload(nextForm),
        );
      }

      return nextForm;
    });
  };

  const selectImageHandler = async () => {
    if (form.attachedImages.length >= 5) {
      return ShowToast('error', 'You can upload up to 5 photos');
    }

    const remainingSlots = 5 - form.attachedImages.length;
    const response = await selectImage('gallery', remainingSlots);
    if (response) {
      const selectedImages = Array.isArray(response) ? response : [response];
      setForm(prev => ({
        ...prev,
        attachedImages: [...prev.attachedImages, ...selectedImages].slice(0, 5),
      }));
    }
  };

  const removeImage = indexToRemove => {
    setForm(prev => ({
      ...prev,
      attachedImages: prev.attachedImages.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const validateForm = () => {
    if (!form.category) {
      ShowToast('error', 'Please select a dispute category');
      return false;
    }

    if (
      form.category === 'Other' &&
      form.otherCategoryExplanation.trim().length < 5
    ) {
      ShowToast('error', 'Please add at least 5 characters for other category');
      return false;
    }

    const descriptionLength = form.description.trim().length;
    if (!descriptionLength) {
      ShowToast('error', 'Please describe the issue');
      return false;
    }

    if (descriptionLength < 100) {
      ShowToast('error', 'Explanation must be at least 100 characters');
      return false;
    }

    if (descriptionLength > 2000) {
      ShowToast('error', 'Explanation cannot exceed 2,000 characters');
      return false;
    }

    if (form.attachedImages.length < 1) {
      ShowToast('error', 'Please upload at least 1 photo or screenshot');
      return false;
    }

    if (form.attachedImages.length > 5) {
      ShowToast('error', 'You can upload up to 5 photos');
      return false;
    }

    if (
      form.requestedOutcome === 'Other' &&
      form.requestedOutcomeOtherExplanation.trim().length < 5
    ) {
      ShowToast(
        'error',
        'Please add at least 5 characters for other requested outcome',
      );
      return false;
    }

    if (!form.confirmationAccepted) {
      ShowToast('error', 'Please accept the dispute acknowledgment');
      return false;
    }

    return true;
  };

  const submitDisputeHandler = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const disputePayload = buildDisputePayload(form);

      console.log('Create dispute API body on submit:', disputePayload);
      const response = await createDispute(disputePayload, token);

      if (response?.success) {
        const dispute = response?.data?.dispute || response?.data;
        Alert.alert('Dispute Submitted', SUCCESS_MESSAGE, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'View Dispute',
            onPress: () =>
              navigation.replace('ViewDispute', {
                bookingData,
                dispute,
              }),
          },
        ]);
      } else {
        ShowToast('error', response?.message || 'Failed to submit dispute');
      }
    } catch (error) {
      console.log('Dispute submission error:', error);
      ShowToast(
        'error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: responsiveHeight(Platform.OS === 'ios' ? 8 : 15),
            backgroundColor: AppColors.WHITE,
          }}>
          <View>
            <AppHeader
              // isLogo
              style={{paddingBottom: responsiveHeight(2)}}
              onPress={() => navigation.goBack()}
              title="Submit Dispute"
            />

            <View style={{padding: responsiveHeight(2)}}>
              {/* Booking Info Card */}
              <View
                style={{
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

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: responsiveHeight(Platform.OS === 'ios' ? 1 : 0),
                  }}>
                  <Image
                    source={{
                      uri: `${ImageBaseUrl}${bookingData?.salonId?.image?.[0]}`,
                    }}
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
                    <View style={{marginTop: responsiveHeight(0.5)}}>
                      {bookingServiceRows.map((row, index) => (
                        <AppText
                          key={`${row}-${index}`}
                          title={row}
                          textSize={1.65}
                          textColor={AppColors.DARKGRAY}
                          mrgnTop={index === 0 ? 0 : 0.35}
                          numberOfLines={2}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Dispute Category */}
              <View style={{marginTop: responsiveHeight(2)}}>
                <OptionGroup
                  title="Dispute Category"
                  options={DISPUTE_CATEGORIES}
                  selectedValue={form.category}
                  onSelect={value => handleInputChange('category', value)}
                />
              </View>

              {form.category === 'Other' && (
                <>
                  <LineBreak space={2} />
                  <AppTextInput
                    label="Other Category Details *"
                    inputPlaceHolder="Please describe the category..."
                    onChangeText={value =>
                      handleInputChange('otherCategoryExplanation', value)
                    }
                    value={form.otherCategoryExplanation}
                    containerBg={AppColors.INPUTBG}
                  />
                </>
              )}

              <LineBreak space={2} />

              {/* Description Input */}
              <AppTextInput
                label="Explanation *"
                inputPlaceHolder="Please describe what happened in detail..."
                multiline={true}
                height={14}
                onChangeText={value =>
                  handleInputChange('description', value.slice(0, 2000))
                }
                value={form.description}
                containerBg={AppColors.INPUTBG}
                txtAlignVertical="top"
              />
              <AppText
                title={`${form.description.trim().length}/2000 characters`}
                textSize={1.4}
                textColor={AppColors.DARKGRAY}
                textAlignment="right"
                mrgnTop={0.8}
              />

              <LineBreak space={2} />

              {/* Requested Outcome */}
              <OptionGroup
                title="Requested Outcome"
                options={REQUESTED_OUTCOMES}
                selectedValue={form.requestedOutcome}
                onSelect={value =>
                  handleInputChange(
                    'requestedOutcome',
                    form.requestedOutcome === value ? '' : value,
                  )
                }
                optional
              />

              {form.requestedOutcome === 'Other' && (
                <>
                  <LineBreak space={2} />
                  <AppTextInput
                    label="Other Requested Outcome Details *"
                    inputPlaceHolder="Please describe the outcome you are requesting..."
                    onChangeText={value =>
                      handleInputChange(
                        'requestedOutcomeOtherExplanation',
                        value,
                      )
                    }
                    value={form.requestedOutcomeOtherExplanation}
                    containerBg={AppColors.INPUTBG}
                  />
                </>
              )}

              <LineBreak space={2} />

              {/* Image Attachments */}
              <AppText
                title="Upload Evidence *"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <AppText
                title="Add at least 1 photo or screenshot. You can upload up to 5 photos."
                textSize={1.6}
                textColor={AppColors.DARKGRAY}
                mrgnTop={0.5}
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
                  title={`Add evidence (${form.attachedImages.length}/5)`}
                  textColor="#A0A0A0"
                />
              </TouchableOpacity>

              {/* Display Selected Images */}
              {form.attachedImages.length > 0 && (
                <FlatList
                  data={form.attachedImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 10,
                    paddingBottom: responsiveHeight(2),
                  }}
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
                        <Entypo
                          name="cross"
                          color={AppColors.WHITE}
                          size={15}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}

              <LineBreak space={2} />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmationToggle}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: responsiveWidth(3),
                  padding: responsiveHeight(1.5),
                  borderRadius: 10,
                  backgroundColor: '#FAFAFA',
                  borderWidth: 1,
                  borderColor: form.confirmationAccepted
                    ? AppColors.BTNCOLOURS
                    : '#E4E4E4',
                }}>
                <View
                  style={{
                    width: responsiveHeight(2.4),
                    height: responsiveHeight(2.4),
                    borderRadius: 4,
                    borderWidth: 1.5,
                    borderColor: form.confirmationAccepted
                      ? AppColors.BTNCOLOURS
                      : AppColors.DARKGRAY,
                    backgroundColor: form.confirmationAccepted
                      ? AppColors.BTNCOLOURS
                      : AppColors.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: responsiveHeight(0.2),
                  }}>
                  {form.confirmationAccepted && (
                    <Entypo
                      name="check"
                      color={AppColors.WHITE}
                      size={responsiveFontSize(1.8)}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <AppText
                    title={CONFIRMATION_TEXT}
                    textSize={1.5}
                    textColor={AppColors.BLACK}
                  />
                </View>
              </TouchableOpacity>

              <LineBreak space={4} />

              {/* Submit Button */}
              <AppButton
                title={
                  isLoading ? (
                    <ActivityIndicator size="small" color={AppColors.WHITE} />
                  ) : (
                    'Submit Dispute'
                  )
                }
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
