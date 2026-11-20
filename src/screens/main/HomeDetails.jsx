/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AppHeader from '../../components/AppHeader';
import {ScrollView} from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '../../components/AppButton';
import {
  addToFavourite,
  getAllReviews,
  getSaloonById,
  getServiceBySalonAndCategoryId,
} from '../../GlobalFunctions';
import {ImageBaseUrl} from '../../BaseUrl';
import {useDispatch, useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';
import {setUserData} from '../../Redux/Slices';
import ReviewsCard from '../../components/ReviewsCard';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import StarRating from 'react-native-star-rating-widget';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {buildBookingServiceSelectionPayload} from '../../utils/bookingSelectionPayload';
import {
  getAccountReviewMessage,
  isAccountUnderReview,
} from '../../utils/accountReviewRestriction';

const HomeDetails = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    saloonId,
    preselectedServices = [],
    rebookMeta = null,
  } = route?.params || {};
  const [saloonData, setSaloonData] = useState();
  const [menuData, setMenuData] = useState([]);
  const [currentCategory, setCurrentCategory] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [services, setServices] = useState();
  const [selectedServices, setSelectedServices] = useState([]);
  const [fvrtLoading, setFvrtLoading] = useState(false);
  const {userData} = useSelector(state => state?.user);
  const userId = userData?._id;
  const favouriteSalonIds = useMemo(
    () =>
      Array.isArray(userData?.favourite)
        ? userData.favourite
            .map(item => (typeof item === 'object' ? item?._id : item))
            .filter(Boolean)
        : [],
    [userData?.favourite],
  );
  const isFvrt = favouriteSalonIds.includes(saloonId);
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedText, setExpandedText] = useState(false);
  const [activeDays, setActiveDays] = useState([]);
  const [firstDay, setFirstDay] = useState(null);

  // console.log('selectedServices', selectedServices);
  console.log('saloonData', saloonData);
  const dispatch = useDispatch();
  // const roundedRating = 2;
  const roundedRating = Math.round(saloonData?.avgRating * 2) / 2;
  const displayRating = Number.isFinite(Number(saloonData?.avgRating))
    ? Number(saloonData?.avgRating).toFixed(1)
    : '0';

  const handleToggleService = item => {
    setSelectedServices(previousServices => {
      const isAlreadySelected = previousServices.some(
        service => service?._id === item?._id,
      );

      if (isAlreadySelected) {
        return previousServices.filter(service => service?._id !== item?._id);
      }

      return [...previousServices, item];
    });
  };

  const handleContinueWithMultipleServices = () => {
    if (isAccountUnderReview(userData)) {
      Alert.alert('Account Under Review', getAccountReviewMessage(userData), [
        {text: 'OK'},
      ]);
      return;
    }

    const payload = buildBookingServiceSelectionPayload({
      salonId: saloonId,
      services: selectedServices,
      isMultiService: true,
      reschedule: false,
      myBookingId: null,
      extra: rebookMeta
        ? {
            source: 'bookAgain',
            ...rebookMeta,
          }
        : undefined,
    });
    console.log('Multi service selection payload:', payload);
    console.log('Multi service selected services:', selectedServices);

    navigation.navigate('StylistSelect', {
      data: payload,
    });
  };

  useEffect(() => {
    if (Array.isArray(preselectedServices) && preselectedServices.length) {
      setSelectedServices(preselectedServices);
    }
  }, [preselectedServices]);

  const getSaloonByIdHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getSaloonById(saloonId);
      if (!response.success) {
        ShowToast('error', response.message);
      }
      setSaloonData(response.data);
    } catch (err) {
      ShowToast('error', err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, [saloonId]);

  useEffect(() => {
    getSaloonByIdHandler();
  }, [getSaloonByIdHandler]);
  useEffect(() => {
    if (saloonData) {
      const active = saloonData?.workingDays?.filter(d => d?.isActive);
      setActiveDays(active);
      setFirstDay(active[0]); // ✔ correct
    }
  }, [saloonData]);
  useEffect(() => {
    const platformCategories = (saloonData?.categoryId || []).map(c => ({
      ...c,
      _source: 'platform',
    }));
    const salonCategories = (saloonData?.salonCategoryId || []).map(c => ({
      ...c,
      _source: 'salon',
    }));
    const merged = [...platformCategories, ...salonCategories];
    setMenuData(merged);
    if (!merged.length) {
      // No categories for this salon — ensure we don't stay stuck loading
      setCurrentCategory(null);
      setServices([]);
      setIsLoading2(false);
    }
  }, [saloonData]);

  useEffect(() => {
    if (menuData?.length > 0 && !currentCategory) {
      setCurrentCategory(menuData[0]._id); // ✅ Set first category
    }
  }, [currentCategory, menuData]);

  const getServicesHandler = useCallback(async () => {
    if (!currentCategory) {
      setServices([]);
      setIsLoading2(false);
      return;
    }
    setIsLoading2(true);
    try {
      const response = await getServiceBySalonAndCategoryId(
        currentCategory,
        saloonId,
        selectedSubCategory || undefined,
      );
      setServices(response.data);
    } catch (err) {
      console.log('getServicesHandler error', err);
      setServices([]);
    } finally {
      setIsLoading2(false);
    }
  }, [currentCategory, saloonId, selectedSubCategory]);

  const addToFavouriteHandler = async () => {
    if (fvrtLoading) {
      return;
    }

    if (!userId || !saloonId) {
      ShowToast('error', 'Unable to update favorites right now.');
      return;
    }

    setFvrtLoading(true);
    try {
      const response = await addToFavourite(userId, saloonId);
      console.log('response', response.data);
      if (response.success) {
        ShowToast('success', response.message);
        const fallbackFavourite = isFvrt
          ? favouriteSalonIds.filter(id => id !== saloonId)
          : [...new Set([...favouriteSalonIds, saloonId])];
        const responseFavourite =
          response?.user?.favourite ||
          response?.data?.user?.favourite ||
          response?.data?.favourite ||
          response?.favourite;
        const updatedUserData = {
          ...userData, // retain previous user data
          favourite: Array.isArray(responseFavourite)
            ? responseFavourite
            : fallbackFavourite,
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
  const getAllReviewsHandler = useCallback(async () => {
    try {
      const response = await getAllReviews(saloonId);
      if (response.success) {
        setAllReviews(response?.data);
      } else {
        ShowToast('error', response.message);
      }
    } catch (err) {
      ShowToast('error', err?.response?.data?.message);
    }
  }, [saloonId]);

  useEffect(() => {
    if (currentCategory) {
      getServicesHandler();
    } else {
      setServices([]);
      setIsLoading2(false);
    }
  }, [currentCategory, getServicesHandler]);

  useEffect(() => {
    getAllReviewsHandler();
  }, [getAllReviewsHandler]);
  const formatTimeTo12Hour = time24 => {
    const [hourStr, minuteStr] = time24?.split(':');
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

  const activeCatObj = menuData.find(c => c._id === currentCategory);
  const currentSubCategories = activeCatObj?.subCategories ?? [];

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: AppColors.WHITE,
          paddingBottom: responsiveHeight(10),
        }}>
        <AppHeader
          isFvrt={isFvrt}
          isFvrtLoading={fvrtLoading}
          title="Salon Details"
          showHeartIcon
          isTextAlignCentered
          style={{justifyContent: 'space-between'}}
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
              marginBottom: responsiveHeight(2),
              backgroundColor: AppColors.WHITE,
            }}>
            <View style={{paddingHorizontal: responsiveHeight(2)}}>
              <FlatList
                horizontal
                data={saloonData?.image}
                contentContainerStyle={{gap: responsiveHeight(2)}}
                renderItem={({item, index}) => {
                  return (
                    <FastImage
                      source={{
                        uri: `${ImageBaseUrl}${item}`,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable,
                      }}
                      style={{
                        alignSelf: 'center',
                        width: responsiveWidth(
                          saloonData?.image?.length === 1 ? 90 : 85,
                        ),
                        height: responsiveHeight(22),
                        borderRadius: 15,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  );
                }}
              />
              <LineBreak space={3} />
              <View
                style={{
                  backgroundColor: AppColors.WHITE,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.15,
                  shadowRadius: 5,
                  padding: responsiveHeight(2),
                  borderRadius: responsiveHeight(1),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <AppText
                    title={saloonData?.salonName}
                    textSize={2.3}
                    textFontWeight
                  />
                  {roundedRating ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // marginTop: responsiveHeight(2),
                        gap: responsiveHeight(1.5),
                      }}>
                      <StarRating
                        starSize={responsiveHeight(2.2)}
                        color={AppColors.RED}
                        rating={roundedRating}
                        maxStars={5}
                        starStyle={{marginHorizontal: 1.5}}
                        onChange={() => console.log('first')}
                      />
                      <AppText
                        title={`${saloonData?.totalReviews}`}
                        textSize={2}
                        textColor="#989898"
                      />
                    </View>
                  ) : null}
                </View>
                <LineBreak space={2} />

                <View style={{gap: responsiveHeight(1.5)}}>
                  <View
                    style={{
                      gap: responsiveHeight(1),
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Ionicons
                      name={'call-outline'}
                      size={responsiveFontSize(2.4)}
                      color={AppColors.RED}
                    />
                    <AppText
                      title={saloonData?.phoneNumber}
                      textSize={1.6}
                      textColor={AppColors.DARKGRAY}
                    />
                  </View>
                  <View
                    style={{
                      gap: responsiveHeight(1),
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Ionicons
                      name={'location-outline'}
                      size={responsiveFontSize(2.4)}
                      color={AppColors.RED}
                    />
                    <AppText
                      title={saloonData?.bussinessAddress}
                      textSize={1.6}
                      textColor={AppColors.DARKGRAY}
                    />
                  </View>
                  {firstDay && (
                    <View>
                      <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: responsiveHeight(1.5),
                          marginBottom: responsiveHeight(1),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            left: responsiveHeight(0.2),
                          }}>
                          <AntDesign
                            name="clockcircleo"
                            size={responsiveFontSize(2)}
                            color={AppColors.RED}
                          />
                          <AppText
                            title={`${formatTimeTo12Hour(
                              firstDay?.startTime,
                            )} - ${formatTimeTo12Hour(
                              firstDay?.endTime,
                            )}, ${getShortDay(firstDay?.day)}`}
                            textSize={1.6}
                            textColor={AppColors.DARKGRAY}
                          />
                        </View>

                        <Ionicons
                          name={expanded ? 'chevron-up' : 'chevron-down'}
                          size={22}
                          color={AppColors.RED}
                        />
                      </TouchableOpacity>
                      {expanded && (
                        <FlatList
                          data={activeDays.slice(1)} // skip first item
                          contentContainerStyle={{gap: responsiveHeight(1)}}
                          renderItem={({item}) => (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                left: responsiveHeight(0.2),
                              }}>
                              <AntDesign
                                name="clockcircleo"
                                size={responsiveFontSize(2)}
                                color={AppColors.RED}
                              />
                              <AppText
                                title={`${formatTimeTo12Hour(
                                  item?.startTime,
                                )} - ${formatTimeTo12Hour(
                                  item?.endTime,
                                )}, ${getShortDay(item?.day)}`}
                                textSize={1.6}
                                textColor={AppColors.DARKGRAY}
                              />
                            </View>
                          )}
                        />
                      )}
                    </View>
                  )}

                  {/* <View style={{gap: 12, justifyContent: 'center'}}></View> */}
                </View>

                <LineBreak space={1.5} />

                {/* <AppText
                  title={saloonData?.description}
                  textSize={1.9}
                  textColor={AppColors.DARKGRAY}
                /> */}
                <View>
                  <Text
                    numberOfLines={expandedText ? undefined : 2}
                    style={{
                      fontSize: responsiveFontSize(1.9),
                      color: AppColors.DARKGRAY,
                    }}>
                    {saloonData?.description}
                  </Text>

                  {saloonData?.description?.length > 50 && (
                    <Text
                      onPress={() => setExpandedText(!expandedText)}
                      style={{
                        marginTop: 5,
                        color: AppColors.BTNCOLOURS,
                        fontSize: responsiveFontSize(1.6),
                        fontWeight: '600',
                      }}>
                      {expandedText ? 'View Less' : 'View More'}
                    </Text>
                  )}
                </View>
              </View>
              <LineBreak space={3} />

              <FlatList
                data={menuData}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 15}}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentCategory(item?._id);
                        setSelectedSubCategory(null);
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
                        textSize={2.1}
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

              {/* SubCategories chips */}
              {currentSubCategories.length > 0 && (
                <View
                  style={{
                    marginTop: responsiveHeight(1.5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: responsiveHeight(1),
                    }}>
                    <View
                      style={{
                        width: 4,
                        height: responsiveHeight(2),
                        backgroundColor: AppColors.BTNCOLOURS,
                        borderRadius: 4,
                      }}
                    />
                    <AppText
                      title="Sub Categories"
                      textSize={1.7}
                      textColor={AppColors.DARKGRAY}
                      styles={{fontWeight: '500', letterSpacing: 0.3}}
                    />
                  </View>
                  <FlatList
                    data={currentSubCategories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(sub, i) => `${sub}-${i}`}
                    contentContainerStyle={{gap: 8, paddingBottom: 4}}
                    renderItem={({item: sub}) => {
                      const isSelected = selectedSubCategory === sub;
                      return (
                        <TouchableOpacity
                          activeOpacity={0.75}
                          onPress={() =>
                            setSelectedSubCategory(isSelected ? null : sub)
                          }
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                            paddingVertical: responsiveHeight(0.75),
                            paddingHorizontal: responsiveWidth(4),
                            borderRadius: responsiveHeight(3),
                            borderWidth: isSelected ? 0 : 1.2,
                            borderColor: '#E0E0E0',
                            backgroundColor: isSelected
                              ? AppColors.BTNCOLOURS
                              : AppColors.WHITE,
                            elevation: isSelected ? 4 : 1,
                            shadowColor: AppColors.BTNCOLOURS,
                            shadowOffset: {
                              width: 0,
                              height: isSelected ? 2 : 1,
                            },
                            shadowOpacity: isSelected ? 0.25 : 0.08,
                            shadowRadius: isSelected ? 4 : 2,
                          }}>
                          {isSelected && (
                            <AntDesign
                              name="checkcircle"
                              size={responsiveFontSize(1.6)}
                              color={AppColors.WHITE}
                            />
                          )}
                          <AppText
                            title={sub}
                            textSize={1.75}
                            textColor={
                              isSelected ? AppColors.WHITE : AppColors.DARKGRAY
                            }
                            styles={{fontWeight: isSelected ? '700' : '400'}}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              )}

              {isLoading2 ? (
                <View
                  style={{
                    marginVertical: responsiveHeight(
                      Platform.OS === 'ios' ? 2 : 1,
                    ),
                  }}>
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
                    const isServiceSelected = selectedServices.some(
                      service => service?._id === item?._id,
                    );

                    return (
                      <TouchableOpacity
                        onPress={() => handleToggleService(item)}
                        style={{
                          borderRadius: 10,
                          backgroundColor: AppColors.WHITE,
                          elevation: 6,
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.15,
                          shadowRadius: 5,
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
                              textSize={2}
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
                                isServiceSelected
                                  ? 'checkcircle'
                                  : 'pluscircleo'
                              }
                              size={responsiveFontSize(2.7)}
                              color={
                                isServiceSelected
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
                  styles={{marginTop: responsiveHeight(2.5)}}
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
                    textSize={2.2}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: responsiveHeight(1),
                    }}>
                    <AntDesign name="star" color={AppColors.RED} size={18} />
                    <AppText
                      textSize={1.9}
                      textColor="#0B0C16"
                      title={`${displayRating} (${saloonData?.totalReviews})`}
                    />
                  </View>
                </View>
                {/* {allReviews?.length > 0 ? ( */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('AllReviews', {saloonId})}>
                  <AppText
                    title="See All"
                    txtDecoration="underline"
                    textSize={1.9}
                    style={styles.textStyle}
                    textColor={AppColors.BTNCOLOURS}
                  />
                </TouchableOpacity>
                {/* ) : null} */}
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
      {selectedServices.length ? (
        <AppButton
          style={{
            position: 'absolute',
            bottom:
              // place button above the bottom tab (tab height ~60) plus safe-area inset
              60 + insets.bottom + responsiveHeight(1),
            width: responsiveWidth(90),
            alignSelf: 'center',
          }}
          title={
            selectedServices.length > 1
              ? `Continue (${selectedServices.length} Services)`
              : 'Continue'
          }
          marginHorizontal={2}
          handlePress={handleContinueWithMultipleServices}
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
