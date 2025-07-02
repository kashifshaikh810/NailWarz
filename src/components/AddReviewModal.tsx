/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import Entypo from 'react-native-vector-icons/Entypo';
import { Rating } from 'react-native-ratings';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';
import { addReviews } from '../GlobalFunctions';
import { ShowToast } from '../GlobalFunctions/auth';
import { useSelector } from 'react-redux';
const AddReviewModal = ({ modalVisible, setModalVisible,setRefresh, onBackdropPress, saloonId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [totalStars, setTotalStars] = useState(2);
  const { userData } = useSelector(state => state.user);

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
    onBackdropPress();
    if (response.success) {
      ShowToast('success', response.message);
      setRefresh();
      setModalVisible(false);
    } else {
      ShowToast('error', response.message);
    }
  };
  return (
    <View>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.1}
        onBackdropPress={onBackdropPress}
        isVisible={modalVisible}
        style={{ margin: 0 }}>
        <View
          style={{
            borderTopLeftRadius: responsiveHeight(1.5),
            borderTopRightRadius: responsiveHeight(1.5),
            width: responsiveWidth(100),
            position: 'absolute',
            backgroundColor: AppColors.WHITE,
            minHeight: responsiveHeight(50),
            bottom: 0,
            padding: responsiveHeight(1),
          }}>
          <TouchableOpacity
            onPress={onBackdropPress}
            style={{ alignSelf: 'flex-end', marginTop: responsiveHeight(1) }}>
            <Entypo name="cross" size={30} />
          </TouchableOpacity>
          <AppText
            title="Give A Star"
            textAlignment="center"
            mrgnTop={1.2}
            textSize={3}
            textColor={AppColors.BTNCOLOURS}
          />
          <Rating
            count={5}
            startingValue={2}
            defaultRating={2}
            size={30}
            onFinishRating={ratings => setTotalStars(ratings)}
            style={{ marginTop: responsiveHeight(2) }}
            starContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'center',
              // fallback to margin-based spacing
              columnGap: 10, // or use marginHorizontal in custom star
            }}
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
          <View style={{ alignItems: 'center', bottom: 5 }}>
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

export default AddReviewModal;
