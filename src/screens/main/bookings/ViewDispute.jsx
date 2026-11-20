/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import {globalStyles} from '../../../GlobalFunctions/styles';
import {ImageBaseUrl} from '../../../BaseUrl';
import moment from 'moment';
import ImageViewing from 'react-native-image-viewing';

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

const ViewDispute = ({route}) => {
  const navigation = useNavigation();
  const {bookingData, dispute} = route?.params || {};
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState([]);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  console.log('ViewDispute bookingData', bookingData);
  console.log('ViewDispute dispute', dispute);

  const categoryLabels = {
    Service_Quality: 'Service Quality Issue',
    Wrong_Service: 'Wrong Service Performed',
    Vendor_No_Show: 'Vendor No-Show / Absence',
    Hygiene_Sanitation: 'Hygiene or Sanitation Concern',
    Damage_Injury: 'Damage or Injury Concern',
    Other: 'Other',
  };

  const requestedOutcomeLabels = {
    Platform_Credit: 'Request Nail Warz Wallet Credit',
    Vendor_Follow_Up: 'Request Vendor Follow-Up',
    Report_Only: 'Report Issue Only',
    Other: 'Other',
  };

  const getDisplayLabel = (value, labelMap) => {
    if (!value) {
      return 'Not provided';
    }

    return labelMap[value] || String(value).replace(/_/g, ' ');
  };
  const bookingServiceRows = getBookingServiceRows(bookingData);
  const getStatusColor = status => {
    switch (status) {
      case 'Submitted':
        return '#FFA500'; // Orange
      case 'Under_Review':
      case 'Vendor_Response_Requested':
      case 'Awaiting_Customer_Info':
        return '#2196F3'; // Blue
      case 'Resolved_Credit_Issued':
      case 'Resolved_No_Action':
      case 'Resolved_Vendor_Warning':
      case 'Report_Only_Closed':
      case 'Closed_Admin':
        return '#4CAF50'; // Green
      default:
        return AppColors.DARKGRAY;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'Submitted':
        return 'Submitted';
      case 'Under_Review':
        return 'Under Review';
      case 'Vendor_Response_Requested':
        return 'Vendor Response Requested';
      case 'Awaiting_Customer_Info':
        return 'Awaiting Customer Info';
      case 'Resolved_Credit_Issued':
        return 'Resolved - Credit Issued';
      case 'Resolved_No_Action':
        return 'Resolved - No Action';
      case 'Resolved_Vendor_Warning':
        return 'Resolved - Vendor Warning';
      case 'Report_Only_Closed':
        return 'Report Only - Closed';
      case 'Closed_Admin':
        return 'Closed by Admin';
      default:
        return status ? String(status).replace(/_/g, ' ') : 'Submitted';
    }
  };

  const getDisputeAttachments = () => {
    return (
      dispute?.attachments ||
      dispute?.images ||
      dispute?.photos ||
      dispute?.evidence ||
      []
    );
  };

  const openImageModal = (imageUri, allImages = []) => {
    const uris = allImages.length > 0 ? allImages : [imageUri];
    const mapped = uris.map(u => ({uri: u}));
    const idx = mapped.findIndex(i => i.uri === imageUri);
    setImageViewerImages(mapped);
    setImageViewerIndex(idx >= 0 ? idx : 0);
    setShowImageModal(true);
  };

  const getAttachmentUri = attachment => {
    if (typeof attachment === 'string') {
      return attachment?.startsWith('http')
        ? attachment
        : `${ImageBaseUrl}${attachment}`;
    }

    const filePath =
      attachment?.url || attachment?.uri || attachment?.path || attachment?.file;

    return filePath?.startsWith('http') ? filePath : `${ImageBaseUrl}${filePath}`;
  };

  const renderAttachment = (
    attachment,
    isVendorResponse = false,
    allAttachments = [],
  ) => {
    const imageUri = getAttachmentUri(attachment);
    const allUris = allAttachments.map(getAttachmentUri).filter(Boolean);

    if (!imageUri) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => openImageModal(imageUri, allUris)}
        style={{
          marginRight: 10,
          marginBottom: 10,
        }}>
        <Image
          source={{uri: imageUri}}
          style={{
            width: responsiveWidth(25),
            height: responsiveWidth(25),
            borderRadius: 8,
            borderWidth: isVendorResponse ? 2 : 1,
            borderColor: isVendorResponse ? '#2196F3' : AppColors.DARKGRAY,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(10),
          backgroundColor: AppColors.WHITE,
        }}>
        <View>
          <AppHeader
            style={{paddingBottom: responsiveHeight(2)}}
            onPress={() => navigation.goBack()}
            title="Dispute Details"
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
              {/* <AppText
                title="Booking Details"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
                marginBottom={responsiveHeight(1)}
                marginTop={responsiveHeight(2)}
              /> */}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{
                    uri: `${ImageBaseUrl}${bookingData?.salonId?.image?.[0]}`,
                  }}
                  style={{
                    height: responsiveHeight(8.5),
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
                    // mrgnTop={0.5}
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

            {/* Dispute Status */}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <AppText
                  title="Dispute Status"
                  textSize={2.2}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />
                <View
                  style={{
                    backgroundColor: getStatusColor(dispute?.status),
                    paddingHorizontal: responsiveWidth(3),
                    paddingVertical: responsiveHeight(0.5),
                    borderRadius: 15,
                  }}>
                  <AppText
                    title={getStatusText(dispute?.status)}
                    textSize={1.6}
                    textColor={AppColors.WHITE}
                    textFontWeight
                  />
                </View>
              </View>

              <LineBreak space={1} />

              <AppText
                title={`Submitted: ${moment(dispute?.createdAt).format(
                  'MMM DD, YYYY hh:mm A',
                )}`}
                textSize={1.7}
                textColor={AppColors.DARKGRAY}
              />

              {dispute?.resolution_type && (
                <AppText
                  title={`Resolution: ${getDisplayLabel(
                    dispute?.resolution_type,
                    {},
                  )}`}
                  textSize={1.7}
                  textColor={getStatusColor(dispute?.status)}
                  mrgnTop={0.5}
                  textFontWeight
                />
              )}
            </View>

            {/* Dispute Details */}
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
                title="Dispute Information"
                textSize={2.2}
                textColor={AppColors.BLACK}
                textFontWeight
                marginBottom={responsiveHeight(1)}
                marginTop={responsiveHeight(2)}
              />

              <View style={{marginBottom: responsiveHeight(2)}}>
                <AppText
                  title="Dispute Category:"
                  textSize={1.9}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />
                <AppText
                  title={getDisplayLabel(dispute?.category, categoryLabels)}
                  textSize={1.8}
                  textColor={AppColors.DARKGRAY}
                  mrgnTop={0.5}
                />
              </View>

              {dispute?.category === 'Other' &&
                dispute?.otherCategoryExplanation && (
                  <View style={{marginBottom: responsiveHeight(2)}}>
                    <AppText
                      title="Dispute Category Details:"
                      textSize={1.9}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                    <AppText
                      title={dispute?.otherCategoryExplanation}
                      textSize={1.8}
                      textColor={AppColors.DARKGRAY}
                      mrgnTop={0.5}
                    />
                  </View>
                )}

              <View style={{marginBottom: responsiveHeight(2)}}>
                <AppText
                  title="Explanation:"
                  textSize={1.9}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />
                <AppText
                  title={dispute?.description}
                  textSize={1.8}
                  textColor={AppColors.DARKGRAY}
                  mrgnTop={0.5}
                />
              </View>

              {dispute?.requestedOutcome && (
                <View style={{marginBottom: responsiveHeight(2)}}>
                  <AppText
                    title="Requested Outcome:"
                    textSize={1.9}
                    textColor={AppColors.BLACK}
                    textFontWeight
                  />
                  <AppText
                    title={getDisplayLabel(
                      dispute?.requestedOutcome,
                      requestedOutcomeLabels,
                    )}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    mrgnTop={0.5}
                  />
                </View>
              )}

              {dispute?.requestedOutcome === 'Other' &&
                dispute?.requestedOutcomeOtherExplanation && (
                  <View style={{marginBottom: responsiveHeight(2)}}>
                    <AppText
                      title="Requested Outcome Details:"
                      textSize={1.9}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                    <AppText
                      title={dispute?.requestedOutcomeOtherExplanation}
                      textSize={1.8}
                      textColor={AppColors.DARKGRAY}
                      mrgnTop={0.5}
                    />
                  </View>
                )}

              {/* User's Evidence */}
              {getDisputeAttachments().length > 0 && (
                <View>
                  <AppText
                    title="Your Evidence:"
                    textSize={1.9}
                    textColor={AppColors.BLACK}
                    textFontWeight
                    marginBottom={responsiveHeight(1)}
                    marginTop={responsiveHeight(2)}
                  />
                    <LineBreak space={0.5} />
                  <FlatList
                    data={getDisputeAttachments()}
                    numColumns={3}
                    renderItem={({item}) =>
                      renderAttachment(item, false, getDisputeAttachments())
                    }
                  />
                </View>
              )}
            </View>

            {/* Vendor Responses */}
            {dispute?.responses && dispute?.responses.length > 0 && (
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
                  title="Vendor Response"
                  textSize={2.2}
                  textColor={AppColors.BLACK}
                  textFontWeight
                  marginBottom={responsiveHeight(2)}
                  marginTop={responsiveHeight(2)}
                />
                <LineBreak space={1.5} />
                {dispute?.responses.map((response, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#F0F8FF',
                      padding: responsiveHeight(1.5),
                      borderRadius: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: '#2196F3',
                      marginBottom: responsiveHeight(2),
                    }}>
                    <AppText
                      title={`Response by: ${response?.respondent}`}
                      textSize={1.7}
                      textColor={'#2196F3'}
                      textFontWeight
                      marginBottom={responsiveHeight(0.5)}
                    />

                    <AppText
                      title={response?.message}
                      textSize={1.8}
                      textColor={AppColors.BLACK}
                      marginBottom={responsiveHeight(1)}
                    />

                    <AppText
                      title={moment(response?.createdAt).format(
                        'MMM DD, YYYY hh:mm A',
                      )}
                      textSize={1.6}
                      textColor={AppColors.DARKGRAY}
                    />
                    {/* Vendor's Evidence */}
                    {response?.attachments &&
                      response?.attachments.length > 0 && (
                        <View style={{marginTop: responsiveHeight(1)}}>
                          <AppText
                            title="Vendor Evidence:"
                            textSize={1.8}
                            textColor={'#2196F3'}
                            textFontWeight
                            marginBottom={responsiveHeight(1)}
                            marginTop={responsiveHeight(2)}
                          />
                    <LineBreak space={0.5} />
                          <FlatList
                            data={response?.attachments}
                            numColumns={3}
                            renderItem={({item}) =>
                              renderAttachment(
                                item,
                                true,
                                response?.attachments,
                              )
                            }
                          />
                        </View>
                      )}
                  </View>
                ))}
              </View>
            )}

            {/* Admin Note (if available) */}
            {(dispute?.adminNote || dispute?.admin_notes) && (
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
                  title="Admin Note"
                  textSize={2.2}
                  textColor={AppColors.BLACK}
                  textFontWeight
                  marginBottom={responsiveHeight(1)}
                />
                <AppText
                  title={dispute?.adminNote || dispute?.admin_notes}
                  textSize={1.8}
                  textColor={AppColors.DARKGRAY}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ImageViewing
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </SafeAreaView>
  );
};

export default ViewDispute;
