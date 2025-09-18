/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {ScrollView} from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import APPImages from '../../assets/APPImages';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppButton from '../../components/AppButton';
import {
  addToFavourite,
  getAllReviews,
  getSaloonById,
  getServiceByCategoryId,
  getServiceBySalonAndCategoryId,
} from '../../GlobalFunctions';
import {ImageBaseUrl} from '../../BaseUrl';
import {useDispatch, useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';
import {setUserData} from '../../Redux/Slices';
import ReviewsCard from '../../components/ReviewsCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const cardData = [
  {id: 1, colorName: 'Solid Color', amount: '$10.00', time: '30 Mins'},
  {
    id: 2,
    colorName: 'Toe Acrylic - Full set',
    amount: '$5.00',
    time: '24 Mins',
  },
];

const HomeDetails = ({route}) => {
  const navigation = useNavigation();
  const {saloonId} = route?.params;
  const [saloonData, setSaloonData] = useState();
  const [menuData, setMenuData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState();
  const [services, setServices] = useState();
  const [selectedService, setSelectedService] = useState();
  const [fvrtLoading, setFvrtLoading] = useState(false);
  const [isFvrt, setIsFvrt] = useState();
  const {_id, favourite} = useSelector(state => state.user?.userData);
  const {userData} = useSelector(state => state?.user);
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  // console.log('selectedService.price', selectedService.price);
  console.log('saloonDatasaloonData', saloonData);
  const dispatch = useDispatch();
  const handleToggleService = item => {
    if (selectedService?._id === item._id) {
      // Unselect if already selected
      setSelectedService(null);
    } else {
      // Select new item
      setSelectedService(item);
    }
  };

  const getSaloonByIdHandler = async () => {
    setIsLoading(true);
    const response = await getSaloonById(saloonId);
    setIsLoading(false);
    if (!response.success) {
      ShowToast('error', response.message);
    }
    setSaloonData(response.data);
  };
  useEffect(() => {
    if (favourite?.includes(saloonId)) {
      setIsFvrt(true);
    } else {
      setIsFvrt(false);
    }
  }, [favourite]);
  useEffect(() => {
    getSaloonByIdHandler();
  }, []);
  useEffect(() => {
    if (saloonData?.categoryId?.length > 0) {
      setMenuData(saloonData.categoryId);
      // setMenu({_id: saloonData.categoryId[0]._id}); // 👈 make first one active
    }
  }, [saloonData]);
  useEffect(() => {
    if (menuData?.length > 0 && !currentCategory) {
      setCurrentCategory(menuData[0]._id); // ✅ Set first category
    }
  }, [menuData]);
  const getServicesHandler = async () => {
    setIsLoading2(true);
    const response = await getServiceBySalonAndCategoryId(
      currentCategory,
      saloonId,
    );
    setIsLoading2(false);
    setServices(response.data);
  };
  const addToFavouriteHandler = async () => {
    setFvrtLoading(true);
    try {
      const response = await addToFavourite(_id, saloonId);
      console.log('response', response.data);
      if (response.success) {
        ShowToast('success', response.message);
        const updatedUserData = {
          ...userData, // retain previous user data
          favourite: response.user.favourite, // update only favourite
        };
        dispatch(setUserData(updatedUserData));

        console.log('updatedUserData', updatedUserData);
      } else {
        ShowToast('error', response.message);
      }
      setFvrtLoading(false);
    } catch (err) {
      ShowToast('error', err?.response?.data?.message);
      setFvrtLoading(false);
    }
  };
  const getAllReviewsHandler = async () => {
    const response = await getAllReviews(saloonId);
    if (response.success) {
      setAllReviews(response?.data);
    } else {
      ShowToast('error', response.message);
    }
  };
  useEffect(() => {
    getServicesHandler();
  }, [currentCategory]);
  useEffect(() => {
    getAllReviewsHandler();
  }, []);
  const formatTimeTo12Hour = time24 => {
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}${minute !== 0 ? `:${minuteStr}` : ''}${ampm}`;
  };
  const getShortDay = day => {
    const map = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return map[day] || day;
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: AppColors.WHITE,
          paddingBottom: responsiveHeight(4.5),
        }}>
        <AppHeader
          isFvrt={isFvrt}
          isFvrtLoading={fvrtLoading}
          handleFavouritePress={addToFavouriteHandler}
          onPress={() => navigation.goBack()}
        />
        {isLoading ? (
          <View style={{flex: 0.8, justifyContent: 'center'}}>
            <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View
            style={{
              marginVertical: responsiveHeight(2),
              backgroundColor: AppColors.WHITE,
            }}>
            <View style={{paddingHorizontal: responsiveHeight(2)}}>
              <FlatList
                horizontal
                data={saloonData?.image}
                contentContainerStyle={{gap: responsiveHeight(2)}}
                renderItem={({item, index}) => {
                  return (
                    <Image
                      source={{
                        uri: `${ImageBaseUrl}${item}`,
                      }}
                      style={{
                        alignSelf: 'center',
                        width: responsiveWidth(85),
                        height: responsiveHeight(25),
                        borderRadius: 15,
                      }}
                    />
                  );
                }}
              />
              <LineBreak space={3} />
              <AppText
                title={saloonData?.salonName}
                textSize={3}
                textFontWeight
              />
              <LineBreak space={1} />

              <View style={{gap: 10}}>
                <View
                  style={{gap: 12, alignItems: 'center', flexDirection: 'row'}}>
                  <EvilIcons
                    name={'location'}
                    size={responsiveFontSize(2.7)}
                    color={AppColors.DARKGRAY}
                  />
                  <AppText
                    title={saloonData?.bussinessAddress}
                    textSize={1.6}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>

                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                  <FontAwesome
                    name={'star'}
                    size={responsiveFontSize(2.7)}
                    color={AppColors.PEACHCOLOUR}
                  />
                  <AppText
                    title={`${saloonData?.avgRating} (${saloonData?.totalReviews})`}
                    textSize={1.6}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>
                <FlatList
                  data={saloonData?.workingDays}
                  contentContainerStyle={{gap: responsiveHeight(1)}}
                  renderItem={({item, index}) => {
                    return item?.isActive ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                        }}>
                        <AntDesign
                          name={'clockcircleo'}
                          size={responsiveFontSize(2)}
                          color={AppColors.DARKGRAY}
                        />
                        <AppText
                          // title={`${item?.startTime}-${item?.endTime}, ${item?.day}`}
                          title={`${formatTimeTo12Hour(
                            item?.startTime,
                          )}-${formatTimeTo12Hour(
                            item?.endTime,
                          )}, ${getShortDay(item?.day)}`}
                          textSize={1.6}
                          textColor={AppColors.DARKGRAY}
                        />
                      </View>
                    ) : null;
                  }}
                />
                {/* <View style={{gap: 12, justifyContent: 'center'}}></View> */}
              </View>

              <LineBreak space={2} />

              <AppText
                title={saloonData?.description}
                textSize={1.9}
                textColor={AppColors.DARKGRAY}
              />

              <LineBreak space={3} />

              <FlatList
                data={menuData}
                horizontal
                contentContainerStyle={{gap: 15}}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentCategory(item?._id);
                        // setMenu({_id: item._id});
                      }}>
                      <AppText
                        title={item?.categoryName}
                        borderBottomWidth={currentCategory === item._id ? 3 : 0}
                        paddingBottom={currentCategory === item._id ? 4 : 0}
                        borderBottomColor={
                          currentCategory === item._id
                            ? AppColors.BLUE
                            : AppColors.WHITE
                        }
                        textSize={1.8}
                        textFontWeight
                        textColor={
                          currentCategory === item._id
                            ? AppColors.BLUE
                            : AppColors.DARKGRAY
                        }
                      />
                    </TouchableOpacity>
                  );
                }}
              />

              <LineBreak space={2} />
              {isLoading2 ? (
                <View style={{marginVertical: responsiveHeight(1)}}>
                  <ActivityIndicator
                    size="large"
                    color={AppColors.BTNCOLOURS}
                  />
                </View>
              ) : services?.length > 0 ? (
                <FlatList
                  data={services}
                  contentContainerStyle={{
                    gap: 15,
                    margin: responsiveHeight(1.2),
                    paddingBottom: responsiveHeight(1.5),
                  }}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        // onPress={() => selectedService ? setSelectedService(null) : setSelectedService(item)}
                        onPress={() => handleToggleService(item)}
                        style={{
                          borderRadius: 10,
                          backgroundColor: AppColors.WHITE,
                          elevation: 6,
                          paddingHorizontal: responsiveWidth(4),
                          paddingVertical: responsiveHeight(2),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View>
                            <AppText
                              title={item?.serviceName}
                              textSize={2.2}
                              textFontWeight
                              textColor={AppColors.BLACK}
                            />
                            <LineBreak space={0.5} />
                            <View style={{flexDirection: 'row', gap: 20}}>
                              <AppText
                                title={`$${item?.price}`}
                                textSize={1.5}
                                textColor={AppColors.DARKGRAY}
                              />
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  gap: 6,
                                }}>
                                <AntDesign
                                  name={'clockcircleo'}
                                  size={responsiveFontSize(1.5)}
                                  color={AppColors.DARKGRAY}
                                />
                                <AppText
                                  title={'30 Mins'}
                                  textSize={1.5}
                                  textColor={AppColors.DARKGRAY}
                                />
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleToggleService(item)}>
                            <AntDesign
                              name={
                                item?._id === selectedService?._id
                                  ? 'checkcircle'
                                  : 'pluscircleo'
                              }
                              size={responsiveFontSize(2.7)}
                              color={
                                item?._id === selectedService?._id
                                  ? AppColors.BLUE
                                  : AppColors.BLACK
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <AppText
                  title={'No Services Found'}
                  textAlignment="center"
                  textFontWeight
                  textSize={2.5}
                />
              )}

              <LineBreak space={2} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: responsiveHeight(2),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsiveHeight(2),
                  }}>
                  <AppText
                    textColor="#0B0C16"
                    textFontWeight
                    title="Reviews"
                    textSize={2.5}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: responsiveHeight(1),
                    }}>
                    <AntDesign name="star" color="#F2A905" size={20} />
                    <AppText
                      textSize={1.9}
                      textColor="#0B0C16"
                      title={`${saloonData?.avgRating} (${saloonData?.totalReviews})`}
                    />
                  </View>
                </View>
                {allReviews?.length > 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AllReviews', {saloonId})
                    }>
                    <AppText
                      title="See All"
                      txtDecoration="underline"
                      textSize={1.9}
                      style={styles.textStyle}
                      textColor={AppColors.BTNCOLOURS}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <FlatList
              horizontal
              contentContainerStyle={{
                gap: responsiveHeight(2),
                marginBottom: responsiveHeight(3),
                // padding: responsiveHeight(1),
                paddingHorizontal: responsiveHeight(2),
              }}
              showsHorizontalScrollIndicator={false}
              data={allReviews.slice(0, 3)}
              renderItem={({item, index}) => {
                return <ReviewsCard data={item} />;
              }}
            />
          </View>
        )}
      </ScrollView>
      {selectedService ? (
        <AppButton
          // title={`Continue (${selectedItems?.length})`}
          style={{
            position: 'absolute',
            bottom: responsiveHeight(1.5),
            width: responsiveWidth(90),
            alignSelf: 'center',
          }}
          title={'Continue'}
          marginHorizontal={2}
          handlePress={() =>
            navigation.navigate('StylistSelect', {
              data: {
                saloonId,
                serviceId: selectedService?._id,
                serviceName: selectedService?.serviceName,
                price: selectedService.price,
                technicians: selectedService?.technicianId,
                reschedule: false,
                myBookingId: null,
              },
            })
          }
        />
      ) : null}
    </SafeAreaView>
  );
};

export default HomeDetails;
const styles = StyleSheet.create({
  textStyle: {
    color: '#C01212',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(2.2),
    // marginTop: 10,
  },
});
