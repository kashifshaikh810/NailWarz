/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  NativeModules,
  Share,
  TouchableOpacity,
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
import RNFS from 'react-native-fs';
import {getBookingById} from '../../GlobalFunctions';
import moment from 'moment';
import RNBlobUtil from 'react-native-blob-util';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const DownloadReceipt = ({route}) => {
  const navigation = useNavigation();
  const [bookingDetails, setBookingDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const formattedTime = moment(bookingDetails?.time, 'HH:mm').format('h:mm A');
  const formattedDate = moment(bookingDetails?.date, 'DD-MM-YYYY').format(
    'ddd, MMM DD',
  );
  const {bookingId} = route?.params;

  console.log('bookingDetails', bookingDetails);
  console.log('bookingDetails', bookingDetails);
  const displayId = `#${bookingId.slice(0, 8).toUpperCase()}`; // short professional ID; full ID stays in PDF
  const sectionDataOne = [
    {id: 1, title: 'Booking ID', subTitle: displayId, fullId: bookingId},
    {id: 2, title: 'Salon', subTitle: bookingDetails?.salonId?.salonName},
    {id: 3, title: 'Customer Name', subTitle: bookingDetails?.userId?.username},
    {id: 4, title: 'Phone', subTitle: bookingDetails?.salonId?.phoneNumber},
    {
      id: 4,
      title: 'Booking Date',
      subTitle: formattedDate,
    },
    {id: 5, title: 'Booking Time', subTitle: bookingDetails?.time},
    {
      id: 6,
      title: 'Technician',
      subTitle: bookingDetails?.technicianId?.fullName,
    },
  ];

  const discountValue = bookingDetails?.discount ?? 6;
  const sectionDataTwo = [
    {
      id: 1,
      title: bookingDetails?.serviceId?.serviceName,
      subTitle: `$${bookingDetails?.serviceId?.price}`,
    },
    {id: 2, title: 'Platform Charges', subTitle: '$5'},
    {id: 3, title: 'Nail Warz Discount', subTitle: `-$${discountValue}`},
    {id: 2, title: 'Total', subTitle: `$${bookingDetails?.totalAmount}`},
    // {id: 3, title: 'Discount', subTitle: '$3.00'},
  ];
  const getBookingByIdHandler = async () => {
    try {
      setIsLoading(true);
      const response = await getBookingById(bookingId);
      setIsLoading(false);
      setBookingDetails(response?.data);
    } catch (err) {
      setIsLoading(false);
      console.log('error', err);
    }
  };

  useEffect(() => {
    getBookingByIdHandler();
  }, []);

  const handleDownloadReceipt = async () => {
    if (!bookingDetails) {
      Alert.alert('Error', 'Booking details not loaded yet.');
      return;
    }

    const htmlContent = `
    <h2 style="text-align:center;">Receipt</h2>
    <p><strong>Booking ID:</strong> ${bookingId}</p>
    <p><strong>Salon:</strong> ${bookingDetails?.salonId?.salonName}</p>
    <p><strong>Customer Name:</strong> ${bookingDetails?.userId?.username}</p>
    <p><strong>Phone:</strong> ${bookingDetails?.salonId?.phoneNumber}</p>
    <p><strong>Booking Date:</strong> ${formattedDate}</p>
    <p><strong>Booking Time:</strong> ${bookingDetails?.time}</p>
    <p><strong>Technician:</strong> ${bookingDetails?.technicianId?.fullName}</p>
    <hr/>
    <p><strong>Service:</strong> ${bookingDetails?.serviceId?.serviceName}</p>
    <p><strong>Total:</strong> $${bookingDetails?.serviceId?.price}</p>
  `;

    try {
      // Android: request appropriate storage permission based on API level
      if (Platform.OS === 'android') {
        const apiLevel = Platform.constants?.Release >= 10 ? 30 : 29; // Estimate API level
        
        if (apiLevel >= 30) {
          // Android 11+ (API 30+) - Use MANAGE_EXTERNAL_STORAGE or scoped storage
          try {
            // For Android 11+, we'll use the document directory or shared Downloads
            // No need for WRITE_EXTERNAL_STORAGE permission
            console.log('Using scoped storage for Android 11+');
          } catch (e) {
            console.log('Scoped storage approach');
          }
        } else {
          // For older Android versions, request WRITE_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to save the receipt',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              'Permission denied',
              'Cannot save receipt without storage permission',
            );
            return;
          }
        }
      }

      // Generate PDF and get file path (prefer filePath). If that fails, request base64 and write with RNFS.
      let pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `receipt_${bookingDetails?._id}`,
      });

      let sourcePath = pdf?.filePath;
      // If PDF generation didn't return a filePath, try base64 and write via RNFS
      if (!sourcePath || !(await RNFS.exists(sourcePath))) {
        console.warn(
          'PDF filePath not available or not found, trying base64 fallback',
        );
        pdf = await RNHTMLtoPDF.convert({
          html: htmlContent,
          fileName: `receipt_${bookingDetails?._id}`,
          base64: true,
        });
        const downloadsDirFallback = RNFS.DocumentDirectoryPath;
        const fallbackPath = `${downloadsDirFallback}/Receipt_${bookingDetails?._id}.pdf`;
        if (pdf?.base64) {
          try {
            await RNFS.writeFile(fallbackPath, pdf.base64, 'base64');
            sourcePath = fallbackPath;
            console.log('Wrote base64 PDF to:', fallbackPath);
          } catch (writeErr) {
            console.warn('RNFS.writeFile(base64) failed', writeErr);
          }
        }
      }
      console.log('Generated PDF at:', sourcePath);

      // iOS: present share sheet so user can save to Files/Downloads
      if (Platform.OS === 'ios') {
        try {
          const shareUrl = `file://${sourcePath}`;
          await Share.share({url: shareUrl, title: 'Nail Warz Receipt'});
          Alert.alert(
            'Success',
            'Use the Share sheet to save or share the receipt.',
          );
          return;
        } catch (shareErr) {
          console.warn('iOS share failed', shareErr);
          // fall through to fallback saving
        }
      }

      // Determine destination path - prefer RNBlobUtil for better cross-platform support
      let downloadsDir;
      let destPath;
      
      if (Platform.OS === 'android') {
        // Use RNBlobUtil for better Android compatibility
        try {
          const dirs = RNBlobUtil.fs.dirs;
          downloadsDir = dirs.DownloadDir || dirs.DocumentDir;
          console.log('Using RNBlobUtil dirs:', dirs);
        } catch (e) {
          // Fallback to RNFS if RNBlobUtil fails
          downloadsDir = RNFS.ExternalStorageDirectoryPath
            ? `${RNFS.ExternalStorageDirectoryPath}/Download`
            : RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
        }
      } else {
        downloadsDir = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
      }
      
      destPath = `${downloadsDir}/Receipt_${bookingDetails?._id}.pdf`;
      console.log('Download destination:', destPath);

      // Copy generated file to Downloads
      try {
        if (Platform.OS === 'android' && RNBlobUtil.android) {
          // Use RNBlobUtil for Android for better permission handling
          try {
            await RNBlobUtil.fs.cp(sourcePath, destPath);
            console.log('RNBlobUtil copy successful');
          } catch (blobErr) {
            console.warn('RNBlobUtil copy failed, trying RNFS:', blobErr);
            await RNFS.copyFile(sourcePath, destPath);
          }
        } else {
          await RNFS.copyFile(sourcePath, destPath);
        }
      } catch (copyErr) {
        console.warn('copyFile failed, attempting moveFile', copyErr);
        try {
          await RNFS.moveFile(sourcePath, destPath);
        } catch (moveErr) {
          console.warn('moveFile also failed, using source path as final destination', moveErr);
          destPath = sourcePath; // Use source as final destination
        }
      }

      // Verify file exists, if not use sourcePath as fallback
      let finalPath = destPath;
      try {
        const exists = await RNFS.exists(destPath);
        if (!exists) {
          const srcExists = await RNFS.exists(sourcePath);
          finalPath = srcExists ? sourcePath : destPath;
        }
      } catch (e) {
        console.warn('exists check failed', e);
      }

      // Register the file so it appears in Downloads (Android)
      if (Platform.OS === 'android') {
        if (
          RNBlobUtil &&
          RNBlobUtil.android &&
          RNBlobUtil.android.addCompleteDownload
        ) {
          try {
            await RNBlobUtil.android.addCompleteDownload(
              `Receipt_${bookingDetails?._id}.pdf`,
              'Nail Warz Receipt',
              'application/pdf',
              destPath,
              true,
            );
          } catch (scanErr) {
            console.warn('addCompleteDownload failed', scanErr);
          }
        } else if (
          NativeModules.RNFetchBlob &&
          NativeModules.RNFetchBlob.scanFile
        ) {
          try {
            NativeModules.RNFetchBlob.scanFile([
              {path: destPath, mime: 'application/pdf'},
            ]);
          } catch (scanErr) {
            console.warn('RNFetchBlob.scanFile failed', scanErr);
          }
        }
      }

      Alert.alert('Success', `Saved to Downloads:\n${finalPath}`);
    } catch (err) {
      console.error('PDF Generation or Save Error:', err);
      Alert.alert('Error', 'Failed to generate or save the PDF.');
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.navigate('Home')} title="Receipt" />
      {isLoading ? (
        <View style={{flex: 0.4, justifyContent: 'center'}}>
          <ActivityIndicator size={40} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: responsiveWidth(5),
            marginVertical: responsiveHeight(2),
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
            <FlatList
              data={sectionDataOne}
              scrollEnabled={false}
              // ItemSeparatorComponent={() => <LineBreak space={1.5} />}
              renderItem={({item, index}) => {
                return (
                  <View>
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
                        // Booking ID row: tappable to copy full ID
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            Clipboard.setString(item.fullId);
                            if (Platform.OS === 'android') {
                              ToastAndroid.show(
                                'Booking ID copied!',
                                ToastAndroid.SHORT,
                              );
                            } else {
                              Alert.alert(
                                'Copied',
                                'Full Booking ID copied to clipboard.',
                              );
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <AppText
                            title={item.subTitle}
                            textSize={2}
                            // textColor={AppColors.BTNCOLOURS}
                          />
                          <Text
                            style={{fontSize: 12, color: AppColors.DARKGRAY}}>
                            ⎘
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <AppText
                          title={item.subTitle}
                          textSize={2}
                          textColor={AppColors.DARKGRAY}
                        />
                      )}
                    </View>
                    {index !== 6 ? (
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
              }}
            />
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
            <FlatList
              data={sectionDataTwo}
              scrollEnabled={false}
              renderItem={({item, index}) => {
                return (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <AppText
                        title={item.title}
                        textSize={2}
                        textColor={AppColors.BLACK}
                      />
                      <AppText
                        title={item.subTitle}
                        textSize={2}
                        textColor={AppColors.DARKGRAY}
                      />
                    </View>
                    {index !== 3 ? (
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
              }}
            />
          </View>
        </View>
      )}

      <View
        style={{
          // flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: AppColors.WHITE,
          paddingHorizontal: responsiveWidth(4),
        }}>
        <AppButton
          title="Download Receipt"
          handlePress={handleDownloadReceipt}
          //   bgColor={AppColors.DARKGRAY}
          //   textColor={AppColors.WHITE}
        />
      </View>

      <LineBreak space={2} />
    </SafeAreaView>
  );
};

export default DownloadReceipt;
