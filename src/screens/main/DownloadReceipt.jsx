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
  const displayId = `${bookingId.slice(0, 6)}...${bookingId.slice(-4)}`;
  const sectionDataOne = [
    {id: 1, title: 'Booking Id', subTitle: displayId},
    {id: 2, title: 'Salon', subTitle: bookingDetails?.salonId?.salonName},
    {id: 3, title: 'Customer Name', subTitle: bookingDetails?.userId?.username},
    {id: 4, title: 'Phone', subTitle: bookingDetails?.salonId?.phoneNumber},
    {
      id: 4,
      title: 'Booking Date',
      subTitle: formattedDate,
    },
    {id: 5, title: 'Booking Time', subTitle: bookingDetails?.time},
    {id: 6, title: 'Stlyist', subTitle: bookingDetails?.technicianId?.fullName},
  ];

  const sectionDataTwo = [
    {
      id: 1,
      title: bookingDetails?.serviceId?.serviceName,
      subTitle: `$${bookingDetails?.serviceId?.price}`,
    },
    {id: 2, title: 'Platform Charges', subTitle: '$5'},
    {id: 3, title: 'Discount', subTitle: '$6'},
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
    <p><strong>Booking Id:</strong> ${bookingId}</p>
    <p><strong>Salon:</strong> ${bookingDetails?.salonId?.salonName}</p>
    <p><strong>Customer Name:</strong> ${bookingDetails?.userId?.username}</p>
    <p><strong>Phone:</strong> ${bookingDetails?.salonId?.phoneNumber}</p>
    <p><strong>Booking Date:</strong> ${formattedDate}</p>
    <p><strong>Booking Time:</strong> ${bookingDetails?.time}</p>
    <p><strong>Stylist:</strong> ${bookingDetails?.technicianId?.fullName}</p>
    <hr/>
    <p><strong>Service:</strong> ${bookingDetails?.serviceId?.serviceName}</p>
    <p><strong>Total:</strong> $${bookingDetails?.serviceId?.price}</p>
  `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        base64: true,
        fileName: `receipt_${bookingDetails?._id}`,
      });

      const filePath = `${RNFS.DownloadDirectoryPath}/Receipt_${bookingDetails?._id}.pdf`;

      await RNFS.writeFile(filePath, pdf.base64, 'base64');

      // ✅ Trigger media scanner so it appears in Downloads folder
      if (NativeModules.RNFetchBlob && NativeModules.RNFetchBlob.scanFile) {
        NativeModules.RNFetchBlob.scanFile([
          {path: filePath, mime: 'application/pdf'},
        ]);
      } else {
        console.log('Scan file module not available');
      }

      Alert.alert('Success', `Saved to Downloads:\n${filePath}`);
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
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            <FlatList
              data={sectionDataOne}
              // ItemSeparatorComponent={() => <LineBreak space={1.5} />}
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
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            <FlatList
              data={sectionDataTwo}
              // ItemSeparatorComponent={() => <LineBreak space={1.5} />}
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
          flex: 1,
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
