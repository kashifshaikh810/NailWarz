/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import LineBreak from './LineBreak';
import AppButton from './AppButton';
import {ImageBaseUrl} from '../BaseUrl';
import {AirbnbRating, Rating} from 'react-native-ratings';
import AppTextInput from './AppTextInput';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {addReviews} from '../GlobalFunctions';
import {ShowToast} from '../GlobalFunctions/auth';
import StarRating from 'react-native-star-rating-widget';
type props = {
  img?: any,
  title?: string,
  location?: string,
  date?: any,
  service?: any,
  bookingType?: any,
  saloonId?: string,
  bookingId?: string,
  cancelBookingOnPress?: () => void,
  onCardPress?: () => void,
  disabled?: boolean,
};

const ratingsStar = [
  {id: 1, iconName: 'staro'},
  {id: 2, iconName: 'staro'},
  {id: 3, iconName: 'staro'},
  {id: 4, iconName: 'staro'},
  {id: 5, iconName: 'staro'},
];

const BookingCard = ({
  img,
  location,
  title,
  date,
  service,
  bookingType,
  saloonId,
  bookingId,
  cancelBookingOnPress,
  onCardPress,
  disabled = false,
}: props) => {
  const navigation = useNavigation();
  const {userData} = useSelector(state => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [totalStars, setTotalStars] = useState(4);
  useEffect(() => {
    // Set the default value when the screen loads
    setTotalStars(3);
  }, []);
  console.log('modalVisible', modalVisible);

  const addReviewsHandler = async () => {
    if (!reviewMsg) {
      return ShowToast('error', 'Plz Leave Your Comments On This!');
    }
    setIsLoading(true);
    const response = await addReviews(
      saloonId,
      userData._id,
      totalStars,
      reviewMsg,
    );
    setIsLoading(false);
    if (response.success) {
      ShowToast('success', response.message);
      setModalVisible(false);
    } else {
      ShowToast('error', response.message);
    }
  };
  return (
    <View
    // onPress={() => navigation.navigate('HomeDetails', {saloonId})}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={onCardPress}
        style={{
          padding: 20,
          paddingTop: 10,
          borderRadius: 10,
          width: responsiveWidth(90),
          alignSelf: 'center',
          backgroundColor: AppColors.WHITE,
          elevation: 7,
        }}>
        <View
          style={
            bookingType === 'canceled'
              ? {flexDirection: 'row', justifyContent: 'space-between'}
              : {}
          }>
          <AppText
            title={date}
            textColor={AppColors.BLACK}
            textSize={1.5}
            textFontWeight
          />
          {bookingType === 'canceled' && (
            <AppText
              title={'Canceled'}
              textColor={AppColors.BTNCOLOURS}
              textSize={1.5}
            />
          )}
        </View>
        <LineBreak space={1} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: `${ImageBaseUrl}${img}`}}
            style={{
              height: responsiveHeight(10),
              width: responsiveHeight(10),
              // resizeMode: 'contain',
              borderRadius: 10,
              marginRight: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: responsiveWidth(60),
            }}>
            <View style={{gap: 5}}>
              <AppText
                title={title}
                textColor={AppColors.BLACK}
                textSize={2}
                textFontWeight
              />
              <AppText
                title={location}
                textSize={2}
                textColor={AppColors.DARKGRAY}
              />
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <AppText
                  title={'Services:'}
                  textSize={2}
                  textColor={AppColors.DARKGRAY}
                />
                <AppText
                  title={service}
                  textSize={2}
                  textColor={AppColors.DARKGRAY}
                />
              </View>
            </View>
          </View>
        </View>

        <LineBreak space={2} />

        {bookingType === 'up_coming' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {/* <AppButton
              title="Cancel Booking"
              bgColor={AppColors.WHITE}
              textColor={AppColors.BTNCOLOURS}
              borderWidth={1}
              borderColor={AppColors.BTNCOLOURS}
              handlePress={cancelBookingOnPress}
            />
            <AppButton
              title="View Receipt"
              handlePress={() =>
                navigation.navigate('DownloadReceipt', {bookingId})
              }
              // bgColor={AppColors.DARKGRAY}
              // textColor={AppColors.WHITE}
            /> */}
          </View>
        )}

        {bookingType === 'completed' && (
          <View>
            {/* <FlatList
              data={ratingsStar}
              contentContainerStyle={{
                paddingHorizontal: responsiveWidth(5),
                flex: 1,
                justifyContent: 'space-between',
              }}
              horizontal
              renderItem={({item}) => {
                return (
                  <TouchableOpacity>
                    <AntDesign
                      name={item.iconName}
                      size={responsiveFontSize(4)}
                      color={AppColors.BLACK}
                    />
                  </TouchableOpacity>
                );
              }}
            /> */}
            {/* <Rating
            
              count={5}
              reviews={[]} // hide default text labels
              defaultRating={3}
              size={30}
            starContainerStyle={{
  flexDirection: 'row',
  justifyContent: 'center',
  // fallback to margin-based spacing
  columnGap: 10, // or use marginHorizontal in custom star
}}
            /> */}
            <AppText
              styles={styles.reviewPrompt}
              title="Leave a review"
              onPress={() => setModalVisible(true)}
              // onPress={() => navigation.navigate('AddReview', {bookingId})}
            />
            <LineBreak space={2} />

            <AppButton
              title="View Receipt"
              handlePress={() =>
                navigation.navigate('DownloadReceipt', {bookingId})
              }
              // bgColor={AppColors.DARKGRAY}
              // textColor={AppColors.WHITE}
            />
          </View>
        )}
      </TouchableOpacity>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setModalVisible(false)}
        isVisible={modalVisible}
        style={{margin: 0}}>
        <View
          style={{
            borderTopLeftRadius: responsiveHeight(1.5),
            borderTopRightRadius: responsiveHeight(1.5),
            // height: responsiveHeight(10),
            width: responsiveWidth(100),
            position: 'absolute',
            backgroundColor: AppColors.WHITE,
            minHeight: responsiveHeight(50),
            bottom: 0,
            padding: responsiveHeight(1),
          }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{alignSelf: 'flex-end', marginTop: responsiveHeight(1)}}>
            <Entypo name="cross" size={30} />
          </TouchableOpacity>
          <AppText
            title="Rate Your Experience"
            textAlignment="center"
            mrgnTop={1.2}
            textSize={3}
            textColor={AppColors.BTNCOLOURS}
          />
          <StarRating
            starSize={45}
            color={AppColors.RED}
            style={{alignSelf: 'center', marginTop: responsiveHeight(1)}}
            rating={totalStars}
            onChange={setTotalStars}
          />
          <View
            style={{
              height: responsiveHeight(17),
              marginVertical: responsiveHeight(3),
              paddingHorizontal: responsiveHeight(2),
            }}>
            <AppTextInput
              onChangeText={value => setReviewMsg(value)}
              multiline
              height={14}
              fntSize={2.3}
              containerBg={AppColors.INPUTBG}
              txtAlignVertical="top"
              inputPlaceHolder="Note...."
            />
          </View>
          <View style={{alignItems: 'center', bottom: 5}}>
            <AppButton
              title={
                isLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Submit'
                )
              }
              width={80}
              bgColor={AppColors.BTNCOLOURS}
              handlePress={addReviewsHandler}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookingCard;
const styles = StyleSheet.create({
  reviewPrompt: {
    color: AppColors.BTNCOLOURS,
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(2.2),
    // marginTop: 10,
  },
});
