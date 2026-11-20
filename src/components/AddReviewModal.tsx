/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {responsiveHeight, responsiveWidth} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';
import Entypo from 'react-native-vector-icons/Entypo';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';
import {addReviews} from '../GlobalFunctions';
import {ShowToast} from '../GlobalFunctions/auth';
import {useSelector} from 'react-redux';
import StarRating from 'react-native-star-rating-widget';
const AddReviewModal = ({
  modalVisible,
  setModalVisible,
  setRefresh,
  onBackdropPress,
  saloonId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [totalStars, setTotalStars] = useState(2);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  console.log('totalstars', totalStars);
  const {userData} = useSelector(state => state.user);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const showSub = Keyboard.addListener('keyboardWillShow', event => {
      setKeyboardHeight(event.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        propagateSwipe
        avoidKeyboard={false}
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
              backgroundColor: AppColors.WHITE,
              borderTopLeftRadius: responsiveHeight(1.5),
              borderTopRightRadius: responsiveHeight(1.5),
              maxHeight: responsiveHeight(72),
              minHeight: responsiveHeight(48),
              padding: responsiveHeight(1),
            }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(2),
              }}>
              <TouchableOpacity
                onPress={onBackdropPress}
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
                  inputPlaceHolder="Comment"
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

export default AddReviewModal;
