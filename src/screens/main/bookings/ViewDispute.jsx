/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
import LineBreak from '../../../components/LineBreak';
import {globalStyles} from '../../../GlobalFunctions/styles';
import {ImageBaseUrl} from '../../../BaseUrl';
import moment from 'moment';
import ImageViewing from 'react-native-image-viewing';

const ViewDispute = ({route}) => {
  const navigation = useNavigation();
  const {bookingData, dispute} = route?.params || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState([]);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
console.log('bookingData',bookingData)
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FFA500'; // Orange
      case 'Under_Review':
        return '#2196F3'; // Blue
      case 'Resolved':
        return '#4CAF50'; // Green
      case 'Rejected':
        return '#F44336'; // Red
      case 'Refunded':
        return '#9C27B0'; // Purple
      default:
        return AppColors.DARKGRAY;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'Under_Review':
        return 'Under Review';
      default:
        return status;
    }
  };

  const openImageModal = (imageUri, allImages = []) => {
    const uris = allImages.length > 0 ? allImages : [imageUri];
    const mapped = uris.map(u => ({uri: u}));
    const idx = mapped.findIndex(i => i.uri === imageUri);
    setImageViewerImages(mapped);
    setImageViewerIndex(idx >= 0 ? idx : 0);
    setShowImageModal(true);
  };

  const renderAttachment = (attachment, isVendorResponse = false, allAttachments = []) => {
    const imageUri = `${ImageBaseUrl}${attachment}`;
    const allUris = allAttachments.map(a => `${ImageBaseUrl}${a}`);

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
                  <AppText
                    title={`${moment(bookingData?.date, 'DD-MM-YYYY').format(
                      'MMM DD, YYYY',
                    )} - ${bookingData?.time}`}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    // mrgnTop={0.5}
                  />
                  <AppText
                    title={`Service: ${bookingData?.serviceId?.serviceName}`}
                    textSize={1.8}
                    textColor={AppColors.DARKGRAY}
                    // mrgnTop={0.5}
                  />
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

              {dispute?.resolvedInFavorOf && (
                <AppText
                  title={`Resolved in favor of: ${dispute?.resolvedInFavorOf}`}
                  textSize={1.7}
                  textColor={getStatusColor('Resolved')}
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
                  title="Reason:"
                  textSize={1.9}
                  textColor={AppColors.BLACK}
                  textFontWeight
                />
                <AppText
                  title={dispute?.reason}
                  textSize={1.8}
                  textColor={AppColors.DARKGRAY}
                  mrgnTop={0.5}
                />
              </View>

              <View style={{marginBottom: responsiveHeight(2)}}>
                <AppText
                  title="Description:"
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

              {/* User's Evidence */}
              {dispute?.attachments && dispute?.attachments.length > 0 && (
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
                    data={dispute?.attachments}
                    numColumns={3}
                    renderItem={({item}) => renderAttachment(item, false, dispute?.attachments)}
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
                              renderAttachment(item, true, response?.attachments)
                            }
                          />
                        </View>
                      )}
                  </View>
                ))}
              </View>
            )}

            {/* Admin Note (if available) */}
            {dispute?.adminNote && (
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
                  title={dispute?.adminNote}
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
