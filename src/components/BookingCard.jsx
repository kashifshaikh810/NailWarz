/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal as RNModal,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import LineBreak from './LineBreak';
import AppButton from './AppButton';
import {ImageBaseUrl} from '../BaseUrl';
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
  onCardPress?: () => void,
  disabled?: boolean,
  hasDispute?: boolean,
  dispute?: any,
  onDisputePress?: () => void,
  onBookAgainPress?: () => void,
  isBookAgainLoading?: boolean,
  onPayNowPress?: () => void,
  serviceItems?: Array<string>,
  showServiceDetailsOnCard?: boolean,
  isPaymentPending?: boolean,
  isExpired?: boolean,
  canPayNow?: boolean,
  payNowTitle?: string,
  isPayNowLoading?: boolean,
  disputeStatus?: string, // 'canDispute' | 'hidden'
};

const BookingCard = ({
  img,
  location,
  title,
  date,
  service,
  bookingType,
  saloonId,
  bookingId,
  onCardPress,
  disabled = false,
  hasDispute = false,
  dispute,
  onDisputePress,
  onBookAgainPress,
  isBookAgainLoading = false,
  onPayNowPress,
  serviceItems = [],
  showServiceDetailsOnCard = false,
  isPaymentPending = false,
  isExpired = false,
  canPayNow = false,
  payNowTitle = 'Pay Now',
  isPayNowLoading = false,
  disputeStatus = 'canDispute',
}: props) => {
  const navigation = useNavigation();
  const {userData} = useSelector(state => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [servicesModalVisible, setServicesModalVisible] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [totalStars, setTotalStars] = useState(4);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    // Set the default value when the screen loads
    setTotalStars(3);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const handleKeyboardShow = event => {
      setKeyboardHeight(event.endCoordinates?.height || 0);
    };
    const handleKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const willShowSub = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow,
    );
    const didShowSub = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow,
    );
    const willHideSub = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide,
    );
    const didHideSub = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      willShowSub.remove();
      didShowSub.remove();
      willHideSub.remove();
      didHideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!modalVisible) {
      setKeyboardHeight(0);
    }
  }, [modalVisible]);
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
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.15,
          shadowRadius: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              bookingType === 'canceled' ||
              bookingType === 'completed' ||
              bookingType === 'expired'
                ? 'space-between'
                : 'flex-start',
            alignItems: 'center',
          }}>
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
          {bookingType === 'expired' && (
            <AppText
              title="Expired"
              textColor={AppColors.BTNCOLOURS}
              textSize={1.5}
            />
          )}
          {bookingType === 'completed' && (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isBookAgainLoading}
              onPress={event => {
                event.stopPropagation();
                onBookAgainPress?.();
              }}
              style={styles.bookAgainPill}>
              {isBookAgainLoading ? (
                <ActivityIndicator
                  size="small"
                  color={AppColors.BTNCOLOURS}
                />
              ) : (
                <AppText
                  title="Book Again"
                  textSize={1.5}
                  textColor={AppColors.BTNCOLOURS}
                  textFontWeight
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        <LineBreak space={1} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FastImage
            source={{
              uri: `${ImageBaseUrl}${img}`,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height: responsiveHeight(10),
              width: responsiveHeight(10),
              borderRadius: 10,
              marginRight: 10,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={{
              flex: 1,
              minWidth: 0,
            }}>
            <View style={{gap: 5, minWidth: 0}}>
              <AppText
                title={title}
                textColor={AppColors.BLACK}
                textSize={2}
                textFontWeight
                numberOfLines={1}
              />
              <AppText
                title={location}
                textSize={2}
                textColor={AppColors.DARKGRAY}
                numberOfLines={1}
              />
              <View style={styles.serviceRow}>
                <AppText
                  title={`Services: ${service || 'Service not available'}`}
                  textSize={2}
                  textColor={AppColors.DARKGRAY}
                  numberOfLines={1}
                  styles={styles.serviceText}
                />
                {showServiceDetailsOnCard && serviceItems?.length > 1 ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={event => {
                      event.stopPropagation();
                      setServicesModalVisible(true);
                    }}
                    style={styles.moreServicesPill}>
                    <AppText
                      title={`+${serviceItems.length - 1}`}
                      textSize={1.25}
                      textColor={AppColors.BTNCOLOURS}
                      textFontWeight
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        <LineBreak space={2} />

        {bookingType === 'expired' || isExpired ? (
          <View style={styles.expiredNotice}>
            <View style={{flex: 1, paddingRight: responsiveWidth(2)}}>
              <AppText
                title="Booking Expired"
                textSize={1.65}
                textFontWeight
                textColor={AppColors.BTNCOLOURS}
              />
              <AppText
                title="Payment was not completed in time. Please rebook to choose a new appointment."
                textSize={1.45}
                textColor="#7A5A00"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isBookAgainLoading}
              onPress={event => {
                event.stopPropagation();
                onBookAgainPress?.();
              }}
              style={styles.payNowButton}>
              {isBookAgainLoading ? (
                <ActivityIndicator size="small" color={AppColors.WHITE} />
              ) : (
                <AppText
                  title="Rebook"
                  textSize={1.45}
                  textColor={AppColors.WHITE}
                  textFontWeight
                />
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        {(bookingType === 'up_coming' || bookingType === 'payment_pending') &&
          isPaymentPending &&
          !isExpired && (
          <View style={styles.paymentNotice}>
            <View style={{flex: 1, paddingRight: responsiveWidth(2)}}>
              <AppText
                title="Payment Pending"
                textSize={1.65}
                textFontWeight
                textColor={AppColors.BTNCOLOURS}
              />
              <AppText
                title={
                  canPayNow
                    ? 'Complete payment within 15 minutes to keep this booking active.'
                    : 'Payment was not completed within the 15-minute window.'
                }
                textSize={1.45}
                textColor="#7A5A00"
              />
            </View>
            {canPayNow ? (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isPayNowLoading}
                onPress={event => {
                  event.stopPropagation();
                  onPayNowPress?.();
                }}
                style={styles.payNowButton}>
                {isPayNowLoading ? (
                  <ActivityIndicator size="small" color={AppColors.WHITE} />
                ) : (
                  <AppText
                    title={payNowTitle}
                    textSize={1.45}
                    textColor={AppColors.WHITE}
                    textFontWeight
                  />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {bookingType === 'completed' && (
          <View>
            <AppText
              styles={styles.reviewPrompt}
              title="Leave a review"
              onPress={() => setModalVisible(true)}
            />
            <LineBreak space={2} />

            <View style={styles.completedActionsRow}>
              {/* Dispute Button */}
              {(hasDispute || disputeStatus === 'canDispute') && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={event => {
                    event.stopPropagation();
                    onDisputePress?.();
                  }}
                  style={[
                    styles.completedActionButton,
                    styles.completedPrimaryAction,
                  ]}>
                  <AppText
                    title={hasDispute ? 'View Dispute' : 'Open Dispute'}
                    textSize={1.55}
                    textColor={AppColors.WHITE}
                    textFontWeight
                  />
                </TouchableOpacity>
              )}

              {/* View Receipt Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={event => {
                  event.stopPropagation();
                  navigation.navigate('DownloadReceipt', {
                    bookingId,
                    fromBookingsCompleted: true,
                  });
                }}
                style={[
                  styles.completedActionButton,
                  styles.completedSecondaryAction,
                ]}>
                <AppText
                  title="View Receipt"
                  textSize={1.55}
                  textColor={AppColors.BTNCOLOURS}
                  textFontWeight
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
      <RNModal
        transparent
        animationType="fade"
        visible={servicesModalVisible}
        onRequestClose={() => setServicesModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setServicesModalVisible(false)}
          style={styles.servicesModalBackdrop}>
          <TouchableOpacity activeOpacity={1} style={styles.servicesModalCard}>
            <AppText
              title="Booked Services"
              textSize={2}
              textColor={AppColors.BLACK}
              textFontWeight
            />
            <LineBreak space={1} />
            {serviceItems.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.serviceModalRow}>
                <AppText
                  title={`${index + 1}.`}
                  textSize={1.7}
                  textColor={AppColors.DARKGRAY}
                />
                <AppText
                  title={item}
                  textSize={1.7}
                  textColor={AppColors.BLACK}
                  styles={{flex: 1}}
                />
              </View>
            ))}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setServicesModalVisible(false)}
              style={styles.servicesModalButton}>
              <AppText
                title="Close"
                textSize={1.55}
                textColor={AppColors.WHITE}
                textFontWeight
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </RNModal>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setModalVisible(false)}
        isVisible={modalVisible}
        avoidKeyboard={false}
        propagateSwipe
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
            width: responsiveWidth(100),
          }}>
          <View
            style={{
              borderTopLeftRadius: responsiveHeight(1.5),
              borderTopRightRadius: responsiveHeight(1.5),
              backgroundColor: AppColors.WHITE,
              maxHeight: responsiveHeight(72),
              minHeight: responsiveHeight(48),
              padding: responsiveHeight(1),
            }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: responsiveHeight(2)}}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  alignSelf: 'flex-end',
                  marginTop: responsiveHeight(1),
                  padding: responsiveHeight(0.5),
                }}>
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
              <View style={{alignItems: 'center'}}>
                <AppButton
                  title={
                    isLoading ? (
                      <ActivityIndicator
                        size={'large'}
                        color={AppColors.WHITE}
                      />
                    ) : (
                      'Submit'
                    )
                  }
                  width={80}
                  bgColor={AppColors.BTNCOLOURS}
                  disabled={isLoading}
                  handlePress={addReviewsHandler}
                />
              </View>
            </ScrollView>
          </View>
          </View>
      </Modal>
    </View>
  );
};

export default BookingCard;
const styles = StyleSheet.create({
  bookAgainPill: {
    borderWidth: 1,
    borderColor: AppColors.BTNCOLOURS,
    borderRadius: 999,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.7),
    backgroundColor: AppColors.WHITE,
  },
  reviewPrompt: {
    color: AppColors.BTNCOLOURS,
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(2.2),
    // marginTop: 10,
  },
  paymentNotice: {
    borderWidth: 1,
    borderColor: '#F3D38B',
    borderRadius: 10,
    backgroundColor: '#FFF8E6',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiredNotice: {
    borderWidth: 1,
    borderColor: '#F3D38B',
    borderRadius: 10,
    backgroundColor: '#FFF8E6',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  payNowButton: {
    backgroundColor: AppColors.BTNCOLOURS,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
  },
  completedActionsRow: {
    flexDirection: 'row',
    gap: responsiveWidth(2.5),
  },
  completedActionButton: {
    flex: 1,
    minHeight: responsiveHeight(4.8),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(2),
  },
  completedPrimaryAction: {
    backgroundColor: AppColors.BTNCOLOURS,
  },
  completedSecondaryAction: {
    backgroundColor: AppColors.WHITE,
    borderWidth: 1,
    borderColor: AppColors.BTNCOLOURS,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
    minWidth: 0,
  },
  serviceText: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  moreServicesPill: {
    borderWidth: 1,
    borderColor: '#E5B4B4',
    borderRadius: 999,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.25),
    backgroundColor: '#FFF4F4',
  },
  servicesModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(6),
  },
  servicesModalCard: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: AppColors.WHITE,
    padding: responsiveHeight(2),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceModalRow: {
    flexDirection: 'row',
    gap: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.7),
  },
  servicesModalButton: {
    alignSelf: 'flex-end',
    marginTop: responsiveHeight(1.2),
    backgroundColor: AppColors.BTNCOLOURS,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(0.9),
  },
});
