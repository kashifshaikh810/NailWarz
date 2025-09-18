/* eslint-disable react-native/no-inline-styles */
import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import React, {useRef, useState} from 'react';
import AppHeader from '../../../components/AppHeader';
import {responsiveHeight} from '../../../utils/Responsive_Dimensions';
import AppColors from '../../../utils/AppColors';
import SaloonsCard from '../../../components/SaloonsCard';
import AppText from '../../../components/AppTextComps/AppText';
import moment from 'moment';
import AppButton from '../../../components/AppButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import {cancelBooking, cancelBookingStatus} from '../../../GlobalFunctions';
import {ShowToast} from '../../../GlobalFunctions/auth';
import BookingDetailsModal from '../../../components/BookingDetailsModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../../GlobalFunctions/styles';

const BookingDetails = ({navigation, route}) => {
  const {data} = route?.params;
  const [cancelLoading, setCancelLoading] = useState(false);
  const refRBSheet = useRef();
  const refRescheduleRBSheet = useRef();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const response = await cancelBookingStatus(data?._id);
      console.log('response', response);
      setCancelLoading(false);
      if (response?.success) {
        refRBSheet.current.close();
        setCancelModalVisible(true);
      } else {
        ShowToast('error', response?.message);
      }
    } catch (err) {
      setCancelLoading(false);
      ShowToast('error', error?.response?.data?.message);
    }
  };
  console.log('data====', data);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
        <View>
          <AppHeader
            isLogo
            style={{paddingBottom: responsiveHeight(2)}}
            onPress={() => navigation.goBack()}
            title="Bookings"
          />
          <View style={{padding: responsiveHeight(2)}}>
            <SaloonsCard
              saloonId={data?.salonId?._id}
              title={data?.salonId?.salonName}
              KM={'2'}
              Rating={data?.salonId?.avgRating}
              TotalNoOfRating={data?.salonId?.totalReviews}
              img={data?.salonId?.image[0]}
              location={data?.salonId?.locationName}
              itemId={data?._id}
              // isShowDeleteIcon={isShowDeleteIcon}
              // setIsShowDeleteIcon={setIsShowDeleteIcon}
              // setShowRemoveModal={setShowRemoveModal}
            />
            <AppText
              title="Booking Details"
              textColor={AppColors.BLACK}
              textSize={2.5}
              mrgnTop={2}
              textFontWeight
            />
            <AppText
              title="Date"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            <AppText
              title={`${moment(data.date, 'DD-MM-YYYY').format(
                'ddd, MMM D',
              )} at ${data?.time}`}
              textColor="#939393"
              textSize={1.9}
              mrgnTop={1}
              // textFontWeight
            />
            <AppText
              title="Stylist"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            <AppText
              title={`${data?.technicianId.fullName} - 30 Mins`}
              textColor="#939393"
              textSize={1.9}
              mrgnTop={1}
              // textFontWeight
            />
            <View
              style={{
                marginTop: responsiveHeight(2),
                gap: responsiveHeight(4),
              }}>
              <View
                style={{
                  height: 1.5,
                  width: '100%',
                  backgroundColor: AppColors.WHITE2,
                }}
              />
              <View
                style={{
                  height: 1.5,
                  width: '100%',
                  backgroundColor: AppColors.WHITE2,
                }}
              />
            </View>
            <AppText
              title="Pricing Details"
              textColor={AppColors.BLACK}
              textSize={2.2}
              mrgnTop={1.5}
              textFontWeight
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText
                title={data?.serviceId?.serviceName}
                textColor={AppColors.DARKGRAY}
                textSize={2.2}
                mrgnTop={1.5}
              />
              <AppText
                title={`$${data?.serviceId?.price}`}
                textColor={AppColors.DARKGRAY}
                textSize={2.2}
                mrgnTop={1.5}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText
                title="Total"
                textColor={AppColors.BLACK}
                textSize={2.2}
                mrgnTop={1.5}
                textFontWeight
              />
              <AppText
                title={`$${data?.serviceId?.price}`}
                textColor={AppColors.BLACK}
                textSize={2.2}
                mrgnTop={1.5}
                textFontWeight
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: responsiveHeight(4),
                justifyContent: 'space-between',
              }}>
              <AppButton
                title="Cancel Booking"
                width={43}
                handlePress={() => refRBSheet.current.open()}
                bgColor={AppColors.WHITE}
                textColor={AppColors.BTNCOLOURS}
                borderWidth={2}
                borderColor={AppColors.BTNCOLOURS}
              />
              <AppButton
                title="Reschedule"
                width={43}
                handlePress={() => refRescheduleRBSheet.current.open()}
              />
            </View>
          </View>
          <RBSheet
            ref={refRBSheet}
            height={400}
            draggable={true}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
            enablePanDownToClose={true}>
            <BookingDetailsModal
              handleBtn1Press={handleCancelBooking}
              handleBtn2Press={() => refRBSheet.current.close()}
              heading="Cancel Booking"
              btn1Title={
                cancelLoading ? (
                  <ActivityIndicator
                    size={'large'}
                    color={AppColors.BTNCOLOURS}
                  />
                ) : (
                  'Yes, Cancel Booking'
                )
              }
              btn2Title="Keep Appointment"
            />
          </RBSheet>
          <RBSheet
            ref={refRescheduleRBSheet}
            height={400}
            draggable={true}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}
            enablePanDownToClose={true}>
            <BookingDetailsModal
              handleBtn1Press={() =>
                navigation.navigate('StylistSelect', {
                  data: {
                    saloonId: data?.salonId?._id,
                    serviceId: data?.serviceId?._id,
                    serviceName: data?.serviceId?.serviceName,
                    price: data?.serviceId?.price,
                    technicians: data?.serviceId?.technicianId,
                    reschedule: true,
                    myBookingId: data?._id,
                  },
                })
              }
              handleBtn2Press={() => refRescheduleRBSheet.current.close()}
              heading="Reschedule"
              btn1Title="Yes, Reschedule"
              btn2Title="Keep Appointment"
            />
          </RBSheet>
          <ConfirmationModal
            iconName={'check'}
            btnContainerWidth={null}
            title={'Booking Canceled'}
            subTitle={'Your appointment has been successfully canceled.'}
            buttonOneTitle="Back to Bookings"
            setVisible={() => {
              setCancelModalVisible(false);
              navigation.goBack();
            }}
            visible={cancelModalVisible}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;
