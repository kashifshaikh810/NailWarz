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

const DownloadReceipt = ({route}) => {
  const navigation = useNavigation();
  const [bookingDetails, setBookingDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const formattedTime = moment(bookingDetails?.time, 'HH:mm').format('h:mm A');
  const formattedDate = moment(bookingDetails?.date, 'DD-MM-YYYY').format(
    'ddd, MMM DD',
  );

  console.log('formattedTime', formattedTime);
  console.log('formattedDate', formattedDate);
  const sectionDataOne = [
    {id: 1, title: 'Salon', subTitle: bookingDetails?.salonId?.salonName},
    {id: 2, title: 'Customer Name', subTitle: bookingDetails?.userId?.username},
    {id: 3, title: 'Phone', subTitle: bookingDetails?.salonId?.phoneNumber},
    {
      id: 4,
      title: 'Booking Date',
      subTitle: formattedDate,
    },
    {id: 5, title: 'Booking Time', subTitle: formattedTime},
    {id: 6, title: 'Stlyist', subTitle: bookingDetails?.technicianId?.fullName},
  ];

  const sectionDataTwo = [
    {
      id: 1,
      title: bookingDetails?.serviceId?.serviceName,
      subTitle: `$${bookingDetails?.serviceId?.price}`,
    },
    {id: 2, title: 'Total', subTitle: `$${bookingDetails?.serviceId?.price}`},
    // {id: 3, title: 'Discount', subTitle: '$3.00'},
  ];
  const {bookingId} = route?.params;
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

    // Optional: Request permission on Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save receipts.',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }
    }

    const htmlContent = `
    <h2 style="text-align:center;">Receipt</h2>
    <p><strong>Salon:</strong> ${bookingDetails?.salonId?.salonName}</p>
    <p><strong>Customer Name:</strong> ${bookingDetails?.userId?.username}</p>
    <p><strong>Phone:</strong> ${bookingDetails?.salonId?.phoneNumber}</p>
    <p><strong>Booking Date:</strong> ${formattedDate}</p>
    <p><strong>Booking Time:</strong> ${formattedTime}</p>
    <p><strong>Stylist:</strong> ${bookingDetails?.technicianId?.fullName}</p>
    <hr/>
    <p><strong>Service:</strong> ${bookingDetails?.serviceId?.serviceName}</p>
    <p><strong>Total:</strong> $${bookingDetails?.serviceId?.price}</p>
  `;
    const filePath = `${RNFS.DownloadDirectoryPath}/receipt_${bookingDetails?._id}.pdf`;
    try {
      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `receipt_${bookingDetails?._id}`,
        directory: '', // Leave empty, since you're giving full path
        filePath: filePath,
      });

      Alert.alert('Success', `Receipt saved at:\n${file.filePath}`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      Alert.alert('Error', 'Could not generate receipt');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader onPress={() => navigation.goBack()} title="Receipt" />
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
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            <FlatList
              data={sectionDataOne}
              ItemSeparatorComponent={() => <LineBreak space={1.5} />}
              renderItem={({item}) => {
                return (
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
                );
              }}
            />
          </View>

          <LineBreak space={2} />

          <View
            style={{
              backgroundColor: AppColors.WHITE,
              borderRadius: 10,
              paddingVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(4),
            }}>
            <FlatList
              data={sectionDataTwo}
              ItemSeparatorComponent={() => <LineBreak space={1.5} />}
              renderItem={({item}) => {
                return (
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
    </View>
  );
};

export default DownloadReceipt;
