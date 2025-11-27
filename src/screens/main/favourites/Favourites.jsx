/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import AppHeader from '../../../components/AppHeader';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AppColors from '../../../utils/AppColors';
import LineBreak from '../../../components/LineBreak';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import SaloonsArray from '../../../utils/SaloonsArray';
import SaloonsCard from '../../../components/SaloonsCard';
import RemoveFavouritesModal from '../../../components/RemoveFavouritesModal';
import {addToFavourite, getAllFvrtsByUserId} from '../../../GlobalFunctions';
import {useDispatch, useSelector} from 'react-redux';
import {ShowToast} from '../../../GlobalFunctions/auth';
import SwipeableItem, {SwipeableItemProps} from 'react-native-swipeable-item';
import AppText from '../../../components/AppTextComps/AppText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setUserData} from '../../../Redux/Slices';
import moment from 'moment';

const Favourites = () => {
  const navigation = useNavigation();
  const {userData} = useSelector(state => state.user);
  const [allSaloons, setAllSaloons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isShowDeleteIcon, setIsShowDeleteIcon] = useState({
    id: 0,
    shown: false,
  });
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const momentDay = moment().day();
  const index = momentDay === 0 ? 6 : momentDay - 1;
  const isFocus = useIsFocused();
  const [saloonId, setSaloonId] = useState('');
  const dispatch = useDispatch();
  console.log('allSaloons', allSaloons);
  const getAllFvrts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFvrtsByUserId(userData?._id);
      setIsLoading(false);
      // if (response.success) {
      //   ShowToast('success', response?.message);
      //   console.log('response.messsage',response?.message);
      // } else {
      //   ShowToast('error', response?.message);
      // }
      setAllSaloons(response?.data);
    } catch (err) {
      ShowToast('error', err?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const removeFromFvrtsHandler = async () => {
    setLoading2(true);
    const response = await addToFavourite(userData?._id, saloonId);
    if (response?.success) {
      ShowToast('success', response?.message);
      const updatedUserData = {
        ...userData, // retain previous user data
        favourite: response.user.favourite, // update only favourite
      };
      dispatch(setUserData(updatedUserData));
      getAllFvrts();
      setShowRemoveModal(false);
    } else {
      ShowToast('error', response?.message);
    }
    setLoading2(false);
  };
  useEffect(() => {
    getAllFvrts();
  }, [isFocus]);
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader onPress={() => navigation.goBack()} title="Favorites" />
      <View
        style={{
          backgroundColor: '#B4B4B4',
          height: 0.5,
          elevation: 5,
          width: '100%',
          marginBottom: responsiveHeight(1.5),
        }}
      />
      {/* <LineBreak space={2} /> */}
      <RemoveFavouritesModal
        loading2={loading2}
        handleBackdropPress={() => setShowRemoveModal(false)}
        visible={showRemoveModal}
        handleAppointmentButtonPress={() => {
          setShowRemoveModal(false);
          setIsShowDeleteIcon({id: 0, shown: false});
        }}
        handleCancelButtonPress={removeFromFvrtsHandler}
      />
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
        </View>
      ) : allSaloons.length > 0 ? (
        <View style={{}}>
          <FlatList
            data={allSaloons}
            contentContainerStyle={{
              gap: 10,
              paddingHorizontal: responsiveWidth(5),
              alignSelf: 'center',
            }}
            // keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <SwipeableItem
                key={item.userData?._id}
                item={item}
                overSwipe={20}
                renderUnderlayLeft={() => (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('iteeem', item);
                      // ✅ Use a short delay to prevent swipe conflict
                      setShowRemoveModal(true);
                      setSaloonId(item?._id);
                    }}
                    style={{
                      backgroundColor: '#FA52521A',
                      // flex: 1,
                      marginTop: responsiveHeight(1.4),
                      height: responsiveHeight(17.2),
                      alignSelf: 'flex-end',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: responsiveWidth(2),
                      paddingHorizontal: responsiveWidth(2.7),
                      borderRadius: 10,
                      gap: 5,
                    }}>
                    <AntDesign
                      name={'delete'}
                      size={responsiveFontSize(2.5)}
                      color={AppColors.BTNCOLOURS}
                    />
                    <AppText
                      title="Remove"
                      textColor={AppColors.BTNCOLOURS}
                      textSize={1.7}
                    />
                  </TouchableOpacity>
                )}
                snapPointsLeft={[100]}>
                <SaloonsCard
                  saloonId={item?._id}
                  title={item?.salonName}
                  KM={'2'}
                  Rating={item.avgRating}
                  TotalNoOfRating={item.totalReviews}
                  img={item?.image[0]}
                  textWidth={48}
                  location={item?.bussinessAddress}
                  itemId={item.userData?._id}
                  workingDays={
                    item?.workingDays ? item?.workingDays[index] : null
                  }
                  isShowDeleteIcon={isShowDeleteIcon}
                  setIsShowDeleteIcon={setIsShowDeleteIcon}
                  setShowRemoveModal={setShowRemoveModal}
                />
              </SwipeableItem>
            )}
          />
        </View>
      ) : (
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <AppText
            title={'No Salons Found'}
            textAlignment="center"
            textFontWeight
            textSize={2.5}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Favourites;
