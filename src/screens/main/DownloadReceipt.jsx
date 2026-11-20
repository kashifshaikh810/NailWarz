/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {getBookingById} from '../../GlobalFunctions';
import moment from 'moment';
import ShareFile from 'react-native-share';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import Feather from 'react-native-vector-icons/Feather';
import {
  buildBookingPricingSummary,
  formatBookingCurrency,
  getDiscountDescriptor,
} from '../../utils/bookingPricing';

const DownloadReceipt = ({route}) => {
  const navigation = useNavigation();
  const {bookingId, fromBookingsCompleted, booking, receiptServices = []} =
    route?.params || {};
  const [bookingDetails, setBookingDetails] = useState(booking);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullBookingId, setShowFullBookingId] = useState(false);

  const handleBackPress = () => {
    if (fromBookingsCompleted) {
      navigation.navigate('Booking', {initialTab: 'Completed'});
      return;
    }

    navigation.navigate('Home');
  };

  console.log('DownloadReceipt bookingDetails:', bookingDetails);
  console.log('DownloadReceipt receiptServices:', receiptServices);
  const flattenBookingValue = value => {
    if (Array.isArray(value)) {
      return value.reduce(
        (items, item) => [...items, ...flattenBookingValue(item)],
        [],
      );
    }

    return value ? [value] : [];
  };
  const getName = value =>
    value?.fullName || value?.username || value?.salonName || value?.name || '';
  const getSalon = () =>
    typeof bookingDetails?.salonId === 'object'
      ? bookingDetails?.salonId
      : typeof bookingDetails?.saloonId === 'object'
      ? bookingDetails?.saloonId
      : {};
  const getUser = () =>
    typeof bookingDetails?.userId === 'object' ? bookingDetails?.userId : {};
  const backendServices = Array.isArray(bookingDetails?.servicesDetail)
    ? bookingDetails.servicesDetail
    : [];
  const oldServiceDetails = flattenBookingValue(bookingDetails?.serviceId).filter(
    service => service && typeof service === 'object',
  );
  const oldTechnicianDetails = flattenBookingValue(
    bookingDetails?.technicianId,
  ).filter(technician => technician && typeof technician === 'object');
  const receiptServiceItems = backendServices.length
    ? backendServices.map((item, index) => {
        const routeService =
          receiptServices.find(
            service => service?.serviceId === item?.service || service?.service === item?.service,
          ) || receiptServices[index] || {};
        return {
          serviceName:
            item?.serviceName ||
            routeService?.serviceName ||
            `Service ${index + 1}`,
          price: Number(item?.price ?? routeService?.price ?? 0),
          _id: item?._id || item?.service || routeService?.serviceId,
          technicianName:
            getName(item?.technician) ||
            item?.technicianName ||
            routeService?.technicianName ||
            '',
          scheduledAt: item?.scheduledAt || routeService?.scheduledAt,
          time: routeService?.time,
          endTime: routeService?.endTime,
        };
      })
    : oldServiceDetails.map((item, index) => ({
        _id: item?._id,
        serviceName: item?.serviceName || `Service ${index + 1}`,
        price: Number(item?.price || 0),
        technicianName: oldTechnicianDetails[index]?.fullName || '',
        scheduledAt: null,
      }));
  const receiptPricingSummary = buildBookingPricingSummary({
    booking: bookingDetails,
    serviceItems: receiptServiceItems,
  });
  const firstScheduledAt = receiptServiceItems.find(item => item?.scheduledAt)
    ?.scheduledAt;
  const formattedDate = firstScheduledAt
    ? moment(firstScheduledAt).format('ddd, MMM DD')
    : moment(bookingDetails?.date, 'DD-MM-YYYY').format('ddd, MMM DD');
  const formattedTime = firstScheduledAt
    ? moment(firstScheduledAt).format('h:mm A')
    : moment(bookingDetails?.time, ['HH:mm', 'h:mm A']).format('h:mm A');
  const serviceTimeLabel =
    receiptServiceItems.length > 1
      ? 'Multiple times'
      : receiptServiceItems[0]?.time || formattedTime;
  const technicianLabel = [
    ...new Set(
      receiptServiceItems.map(item => item?.technicianName).filter(Boolean),
    ),
  ].join(', ');
  const salonDetails = getSalon();
  const userDetails = getUser();
  const fullBookingId = bookingId || bookingDetails?._id || '';
  const bookingDisplayId = fullBookingId
    ? `#${fullBookingId.slice(-8).toUpperCase()}`
    : '';
  const sectionDataOne = [
    {
      id: 1,
      title: 'Booking ID',
      subTitle: bookingDisplayId,
      fullId: fullBookingId,
    },
    {id: 2, title: 'Salon', subTitle: salonDetails?.salonName || ''},
    {id: 3, title: 'Customer Name', subTitle: userDetails?.username || ''},
    {id: 4, title: 'Phone', subTitle: salonDetails?.phoneNumber || ''},
    {
      id: 4,
      title: 'Booking Date',
      subTitle: formattedDate,
    },
    ...(receiptServiceItems.length > 1
      ? []
      : [
          {id: 5, title: 'Booking Time', subTitle: serviceTimeLabel},
          {
            id: 6,
            title: 'Technician',
            subTitle: technicianLabel,
          },
        ]),
  ];

  const sectionDataTwo = [
    ...receiptServiceItems.map((item, index) => ({
      id: `service-${index}`,
      title: item?.serviceName || `Service ${index + 1}`,
      subTitle: formatBookingCurrency(item?.price),
      detail:
        receiptServiceItems.length > 1
          ? [item?.technicianName, item?.time || moment(item?.scheduledAt).format('h:mm A')]
              .filter(Boolean)
              .join(' • ')
          : '',
    })),
    {
      id: 'subtotal',
      title: 'Services Subtotal',
      subTitle: formatBookingCurrency(receiptPricingSummary.subtotal),
    },
    {
      id: 'appCharges',
      title: 'Platform Charges',
      subTitle: formatBookingCurrency(receiptPricingSummary.appCharges),
    },
    ...(receiptPricingSummary.discountAmount > 0
      ? [
          {
            id: 'discount',
            title: 'Nail Warz Discount',
            subTitle: `-${formatBookingCurrency(
              receiptPricingSummary.discountAmount,
            )}`,
            detail: getDiscountDescriptor(receiptPricingSummary.discountDetails),
            isDiscount: true,
          },
        ]
      : []),
    {
      id: 'total',
      title: 'Total',
      subTitle: formatBookingCurrency(receiptPricingSummary.totalAmount),
      isTotal: true,
    },
  ];
  const getBookingByIdHandler = useCallback(async () => {
    if (!bookingId) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await getBookingById(bookingId);
      setIsLoading(false);
      if (response?.data) {
        setBookingDetails(response.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log('error', err);
    }
  }, [bookingId]);

  useEffect(() => {
    getBookingByIdHandler();
  }, [getBookingByIdHandler]);

  const copyBookingId = () => {
    Clipboard.setString(fullBookingId);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Booking ID copied!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Full Booking ID copied to clipboard.');
    }
  };

  const handleDownloadReceipt = async () => {
    if (isDownloading) {
      return;
    }

    if (!bookingDetails) {
      Alert.alert('Error', 'Booking details not loaded yet.');
      return;
    }

    const htmlContent = `
    <h2 style="text-align:center;">Receipt</h2>
    <p><strong>Booking ID:</strong> ${fullBookingId}</p>
    <p><strong>Salon:</strong> ${salonDetails?.salonName || ''}</p>
    <p><strong>Customer Name:</strong> ${userDetails?.username || ''}</p>
    <p><strong>Phone:</strong> ${salonDetails?.phoneNumber || ''}</p>
    <p><strong>Booking Date:</strong> ${formattedDate}</p>
    ${
      receiptServiceItems.length > 1
        ? ''
        : `<p><strong>Booking Time:</strong> ${serviceTimeLabel}</p>
           <p><strong>Technician:</strong> ${technicianLabel}</p>`
    }
    <hr/>
    ${receiptServiceItems
      .map(
        item =>
          `<p>
            <strong>${item?.serviceName || 'Service'}:</strong> ${formatBookingCurrency(item?.price)}
            ${
              receiptServiceItems.length > 1
                ? `<br/><span>${[
                    item?.technicianName,
                    item?.time || moment(item?.scheduledAt).format('h:mm A'),
                  ]
                    .filter(Boolean)
                    .join(' • ')}</span>`
                : ''
            }
          </p>`,
      )
      .join('')}
    <p><strong>Services Subtotal:</strong> ${formatBookingCurrency(
      receiptPricingSummary.subtotal,
    )}</p>
    <p><strong>Platform Charges:</strong> ${formatBookingCurrency(
      receiptPricingSummary.appCharges,
    )}</p>
    ${
      receiptPricingSummary.discountAmount > 0
        ? `<p><strong>Nail Warz Discount:</strong> -${formatBookingCurrency(
            receiptPricingSummary.discountAmount,
          )}<br/><span>${getDiscountDescriptor(
            receiptPricingSummary.discountDetails,
          )}</span></p>`
        : ''
    }
    <p><strong>Total:</strong> ${formatBookingCurrency(
      receiptPricingSummary.totalAmount,
    )}</p>
  `;

    setIsDownloading(true);

    try {
      const rawFileName = `Nail_Warz_Receipt_${
        bookingDetails?._id || bookingId || Date.now()
      }`;
      const fileName = rawFileName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName,
        ...(Platform.OS === 'ios' ? {directory: 'Documents'} : {}),
      });

      if (!pdf?.filePath) {
        throw new Error('PDF file path was not created.');
      }

      const pdfExists = await RNFS.exists(pdf.filePath);
      if (!pdfExists) {
        throw new Error('Generated PDF could not be found on the device.');
      }

      if (Platform.OS === 'android') {
        const savedUri = await RNBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: `${fileName}.pdf`,
            parentFolder: 'Nail Warz Receipts',
            mimeType: 'application/pdf',
          },
          'Download',
          pdf.filePath,
        );

        console.log('Receipt PDF saved to Downloads:', {
          filePath: pdf.filePath,
          savedUri,
          fileName,
        });

        Alert.alert(
          'Receipt Saved',
          'Your receipt has been saved to Downloads > Nail Warz Receipts.',
        );
        return;
      }

      const fileUrl = pdf.filePath.startsWith('file://')
        ? pdf.filePath
        : `file://${pdf.filePath}`;
      const shareOptions = {
        title: 'Nail Warz Receipt',
        message: 'Save or share your Nail Warz receipt.',
        url: fileUrl,
        type: 'application/pdf',
        filename: `${fileName}.pdf`,
        failOnCancel: false,
        subject: 'Nail Warz Receipt',
        saveToFiles: true,
      };

      console.log('Receipt PDF generated:', {
        filePath: pdf.filePath,
        fileName,
        platform: Platform.OS,
      });

      await ShareFile.open(shareOptions);
    } catch (err) {
      console.error('PDF Generation or Save Error:', err);
      Alert.alert(
        'Error',
        'Unable to download the receipt. Please try again.',
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader
        onPress={handleBackPress}
        title={fromBookingsCompleted ? 'Back to Bookings' : 'Receipt'}
      />
      {isLoading ? (
        <View style={{flex: 0.4, justifyContent: 'center'}}>
          <ActivityIndicator size={40} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(5),
            paddingTop: responsiveHeight(2),
            paddingBottom: responsiveHeight(10),
          }}>
          <View
            style={{
              backgroundColor: AppColors.WHITE,
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.15,
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            {sectionDataOne.map((item, index) => {
              return (
                <View key={`${item.title}-${index}`}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <AppText
                      title={item.title}
                      textSize={2}
                      textColor={AppColors.BLACK}
                    />
                    {item.fullId ? (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        hitSlop={{top: 8, right: 8, bottom: 8, left: 8}}
                        onPress={() =>
                          setShowFullBookingId(previous => !previous)
                        }
                        style={{
                          alignItems: 'flex-end',
                          flex: 1,
                          marginLeft: responsiveWidth(3),
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: responsiveWidth(1.5),
                          }}>
                          <Text
                            style={{
                              color: AppColors.DARKGRAY,
                              fontSize: 15,
                              fontWeight: '700',
                            }}>
                            {item.subTitle}
                          </Text>
                          <View
                            style={{
                              alignItems: 'center',
                              height: responsiveHeight(3.4),
                              justifyContent: 'center',
                              width: responsiveHeight(3.4),
                            }}>
                            <Feather
                              name={
                                showFullBookingId
                                  ? 'chevron-up'
                                  : 'chevron-down'
                              }
                              color={AppColors.DARKGRAY}
                              size={18}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <AppText
                        title={item.subTitle}
                        textSize={2}
                        textColor={AppColors.DARKGRAY}
                      />
                    )}
                  </View>
                  {item.fullId && showFullBookingId ? (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={copyBookingId}
                      style={{
                        backgroundColor: '#FAFAFA',
                        borderColor: AppColors.WHITE2,
                        borderWidth: 1,
                        borderRadius: 8,
                        marginTop: responsiveHeight(1.2),
                        paddingHorizontal: responsiveWidth(3),
                        paddingVertical: responsiveHeight(1.2),
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flex: 1, paddingRight: responsiveWidth(2)}}>
                          <Text
                            style={{
                              color: AppColors.BTNCOLOURS,
                              fontSize: 11,
                              fontWeight: '700',
                              marginBottom: responsiveHeight(0.4),
                              textTransform: 'uppercase',
                            }}>
                            Reference details
                          </Text>
                          <Text
                            selectable
                            style={{
                              color: AppColors.DARKGRAY,
                              flexShrink: 1,
                              fontSize: 12,
                              lineHeight: 18,
                            }}>
                            Booking ID: {item.fullId}
                          </Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                          <View
                            style={{
                              alignItems: 'center',
                              backgroundColor: AppColors.WHITE,
                              borderColor: '#E5E5E5',
                              borderRadius: 8,
                              borderWidth: 1,
                              justifyContent: 'center',
                              padding: responsiveHeight(0.9),
                            }}>
                            <Feather
                              name="copy"
                              color={AppColors.BTNCOLOURS}
                              size={16}
                            />
                          </View>
                          <Text
                            style={{
                              color: AppColors.BTNCOLOURS,
                              fontSize: 11,
                              fontWeight: '700',
                              marginTop: responsiveHeight(0.6),
                            }}>
                            Copy ID
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {index !== sectionDataOne.length - 1 ? (
                    <View
                      style={{
                        backgroundColor: '#b4b4b4',
                        height: 1,
                        // elevation: 5,
                        marginVertical: responsiveHeight(1.7),
                        width: '100%',
                      }}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>

          <LineBreak space={2} />

          <View
            style={{
              backgroundColor: AppColors.WHITE,
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.15,
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            {sectionDataTwo.map((item, index) => {
              return (
                <View key={`${item.title}-${index}`}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <View style={{flex: 1, paddingRight: responsiveWidth(3)}}>
                      <AppText
                        title={item.title}
                        textSize={2}
                        textColor={
                          item.isDiscount ? '#147A3D' : AppColors.BLACK
                        }
                        textFontWeight={item.isTotal}
                      />
                      {item.detail ? (
                        <AppText
                          title={item.detail}
                          textSize={1.45}
                          textColor={AppColors.DARKGRAY}
                          numberOfLines={2}
                        />
                      ) : null}
                    </View>
                    <AppText
                      title={item.subTitle}
                      textSize={2}
                      textColor={
                        item.isDiscount
                          ? '#147A3D'
                          : item.isTotal
                          ? AppColors.BLACK
                          : AppColors.DARKGRAY
                      }
                      textFontWeight={item.isTotal}
                    />
                  </View>
                  {index !== sectionDataTwo.length - 1 ? (
                    <View
                      style={{
                        backgroundColor: '#b4b4b4',
                        height: 1,
                        // elevation: 5,
                        marginVertical: responsiveHeight(1.7),

                        width: '100%',
                      }}
                    />
                  ) : null}
                </View>
              );
            })}
          </View>

          <LineBreak space={2} />

          <AppButton
            title="Download Receipt"
            handlePress={handleDownloadReceipt}
            disabled={isDownloading}
            isLoading={isDownloading}
            //   bgColor={AppColors.DARKGRAY}
            //   textColor={AppColors.WHITE}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DownloadReceipt;
