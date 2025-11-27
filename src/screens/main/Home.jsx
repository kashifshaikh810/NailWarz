/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppText from '../../components/AppTextComps/AppText';
import AppColors from '../../utils/AppColors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import BackgroundScreen from '../../components/AppTextComps/BackgroundScreen';
import AppTextInput from '../../components/AppTextInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APPImages from '../../assets/APPImages';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../components/AppButton';
import Entypo from 'react-native-vector-icons/Entypo';
import SaloonsCard from '../../components/SaloonsCard';
import SaloonsArray from '../../utils/SaloonsArray';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import {
  createCustomer,
  getAllCategories,
  getAllSaloons,
  getSaloons,
} from '../../GlobalFunctions';
import {editProfile, ShowToast} from '../../GlobalFunctions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../../Redux/Slices';
import moment from 'moment';

const Home = () => {
  const [serviceSelected, setServiceSelect] = useState(0);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    categoryId: '',
    categoryName: '',
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {token, userData} = useSelector(state => state?.user);
  console.log('userData', userData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [searchedSalon, setSearchedSalon] = useState();
  const [isNearby, setIsNearby] = useState(true);
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState({
    latitude: 37.4219983,
    longitude: -122.084,
  });
  const [saloons, setSaloons] = useState([]);
  console.log('isNearby', isNearby);
  const currentDate = new Date();
  const momentDay = moment().day();
  const index = momentDay === 0 ? 6 : momentDay - 1;
  console.log('current', moment(currentDate).day());
  console.log('momentDay', momentDay);
  console.log(
    'currentCategory',
    saloons[0]?.workingDays[moment(currentDate).day() - 1],
  );

  useEffect(() => {
    const initLocation = async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        console.log('granted', granted);
        getCurrentLocation();
      }
    };

    initLocation();
  }, []);
  useEffect(() => {
    getAllCategoriesHandler();
  }, []);
  useEffect(() => {
    if (currentCategory?.categoryId) {
      if (searchedSalon && searchedSalon.trim() !== '') {
        // When searching, always get from All Saloons
        getAllSaloonsHandler();
      } else {
        // When search is empty, go back to Nearby saloons
        getSaloonsHandler();
      }
    }
  }, [searchedSalon]);
  const getAllCategoriesHandler = async () => {
    setIsLoading(true);
    const response = await getAllCategories();
    setIsLoading(false);
    if (response.success) {
      const fetchedCategories = response.data;
      setCategories(fetchedCategories);

      // 👇 Auto-select the first category if available
      if (fetchedCategories.length > 0) {
        setCurrentCategory({
          categoryId: fetchedCategories[0]?._id,
          categoryName: fetchedCategories[0]?.categoryName,
        });
      }
    } else {
      ShowToast('error', response?.message);
    }
  };
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            'User-Agent': 'ReactNativeApp', // required by Nominatim
          },
        },
      );
      const json = await response.json();
      const fetchedAddress = json.display_name;
      console.log('Address:', fetchedAddress);
      setAddress(fetchedAddress);
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(position);
        setLatLng({latitude, longitude});
        fetchAddressFromCoords(latitude, longitude); // ✅ call here with params
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const getSaloonsHandler = async () => {
    console.log('catid', currentCategory?.categoryId);
    console.log('lat', latLng?.latitude);
    console.log('lng', latLng?.longitude);
    try {
      setIsLoading2(true);
      const response = await getSaloons({
        latitude: latLng?.latitude,
        longitude: latLng?.longitude,
        categoryId: currentCategory?.categoryId || undefined,
      });
      setIsLoading2(false);
      console.log('getSaloons response', response);

      if (response?.data?.length > 0) {
        setIsNearby(true);
        setSaloons(response.data);
      } else {
        // fallback if no nearby saloons
        setIsNearby(false);
        getAllSaloonsHandler();
      }
    } catch (error) {
      setIsLoading2(false);
      ShowToast('error', 'Failed to fetch saloons');
      console.log('getSaloonsHandler error:', error.response);
    }
  };

  // 🔹 Get all saloons (for search or fallback)
  const getAllSaloonsHandler = async () => {
    try {
      setIsLoading2(true);
      const response = await getAllSaloons({
        saloonName: searchedSalon || undefined,
        categoryId: currentCategory?.categoryId || undefined,
      });
      setIsLoading2(false);
      console.log('getAllSaloons response', response);

      if (response?.data?.length > 0) {
        setSaloons(response.data);
      } else {
        setSaloons([]);
      }
    } catch (error) {
      setIsLoading2(false);
      ShowToast('error', 'Failed to fetch saloons');
      console.log('getAllSaloonsHandler error:', error);
    }
  };

  const createCustomerHandler = async () => {
    try {
      const response = await createCustomer(token);
      if (response?.success) {
        dispatch(
          setUserData({
            ...userData,
            stripeCustomerId: response?.stripeCustomerId,
          }),
        );
      }
      console.log('response', response);
    } catch (error) {
      console.log('eeeerrrror', error.response);
      return ShowToast('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (!userData?.stripeCustomerId) {
      createCustomerHandler();
    }
  }, []);
  useEffect(() => {
    if (currentCategory?.categoryId) {
      getSaloonsHandler();
    }
  }, [currentCategory]);

  return (
    <BackgroundScreen padding={0.1} bgColor={'#fff'}>
      <View style={{padding: 20, paddingBottom: 0, paddingTop: 2}}>
        <Image
          source={APPImages.LOGO}
          style={{
            alignSelf: 'center',
            height: responsiveHeight(15),
            width: responsiveWidth(23),
            // height: responsiveHeight(8.5),
            // width: responsiveWidth(13),
            marginTop: responsiveHeight(2),
          }}
          // resizeMode="contain"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            // onPress={() => navigation.navigate('SearchLocation')}
          >
            <EvilIcons
              name={'location'}
              color={'#D1D1D1'}
              size={responsiveFontSize(5)}
            />
            <View>
              <AppText textColor={'#D1D1D1'} title="Location" textSize={1.9} />
              <AppText
                textColor={'#D1D1D1'}
                title={address}
                textwidth={60}
                numberOfLines={2}
                textSize={1.8}
                textFontWeight
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={{
              borderWidth: 1,
              padding: responsiveHeight(1.5),
              borderRadius: 10,
              borderColor: '#F5F5F5',
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={responsiveFontSize(3)}
              color={AppColors.BLACK}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}>
          <AppTextInput
            onChangeText={value => setSearchedSalon(value)}
            containerBg={AppColors.INPUTBG}
            inputPlaceHolder={'Search By Salon Name'}
            logo={
              <AntDesign
                name={'search1'}
                size={responsiveFontSize(2)}
                color={AppColors.BLACK}
              />
            }
          />
        </View>
      </View>
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <ImageBackground
            source={APPImages.DISCOUNT}
            style={{
              width: responsiveWidth(90),
              height: responsiveHeight(20),
              borderRadius: 15,
              margin: 20,
              overflow: 'hidden',
              padding: 20,
              marginTop: 20,
            }}>
            <View
              style={{
                position: 'absolute',
                zIndex: 2,
                padding: 20,
              }}>
              <View style={{gap: responsiveHeight(0.1)}}>
                <AppText
                  title="Compete For Nail Champion"
                  textSize={2}
                  styles={{fontWeight: '800'}}
                  textColor={AppColors.WHITE}
                />
                <AppText
                  title="Get 20% Off"
                  textSize={2.5}
                  textColor={AppColors.WHITE}
                  styles={{fontWeight: '900'}}
                />
                <AppText textSize={1.7} textColor={AppColors.WHITE}>
                  Get your next manicure for{' '}
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: responsiveFontSize(1.7),
                    }}>
                    FREE
                  </Text>{' '}
                  on us!
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('BattleForm')}
                style={{
                  backgroundColor: AppColors.WHITE,
                  alignSelf: 'flex-start',
                  padding: 10,
                  paddingHorizontal: responsiveHeight(2),
                  borderRadius: responsiveHeight(4),
                  marginTop: responsiveHeight(1.5),
                }}>
                <AppText
                  styles={{fontWeight: '900'}}
                  title="Enter the War"
                  textColor="#D80F0F"
                  textSize={2}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {categories.length > 0 ? (
            <View style={{marginTop: 10, gap: 10}}>
              <AppText
                title="Services"
                textColor={AppColors.BLACK}
                textSize={2.5}
                textFontWeight
                styles={{marginLeft: 20}}
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 10,
                    paddingLeft: 20,
                    paddingRight: 10,
                    marginBottom: 10,
                  }}
                  renderItem={({item, index}) => {
                    const logic =
                      currentCategory.categoryName == item?.categoryName;
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          setCurrentCategory({
                            categoryId: item?._id,
                            categoryName: item?.categoryName,
                          })
                        }
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                          backgroundColor: logic
                            ? AppColors.BTNCOLOURS
                            : AppColors.WHITE,
                          borderRadius: 10,
                          gap: 5,
                          elevation: 5,
                        }}>
                        {/* <Image
                    source={item.icon}
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                  /> */}
                        <AppText
                          title={item?.categoryName}
                          textSize={1.9}
                          textColor={logic ? AppColors.WHITE : '#A0A0A0'}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          ) : null}
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
                marginHorizontal: 20,
              }}>
              <AppText
                title={isNearby ? 'Salons Near You' : 'Salons'}
                textColor={AppColors.BLACK}
                textSize={2.5}
                textFontWeight
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('MapViewScreen')}
                // onPress={() => alert('Under Development')}
                style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                <Entypo
                  name={'location'}
                  color={AppColors.BLUE}
                  size={responsiveFontSize(2)}
                />
                <View>
                  <AppText
                    title="View on Map"
                    textColor={AppColors.BLUE}
                    textSize={1.9}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {isLoading2 ? (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
              </View>
            ) : saloons.length > 0 ? (
              <FlatList
                data={saloons}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 10,
                  backgroundColor: 'white',
                  paddingHorizontal: responsiveHeight(2),
                  alignItems: 'center',
                  marginTop: responsiveHeight(2),
                }}
                renderItem={({item}) => {
                  return (
                    <SaloonsCard
                      title={item?.salonName}
                      KM={'km'}
                      saloonId={item?._id}
                      Rating={item?.avgRating}
                      TotalNoOfRating={item?.totalReviews}
                      workingDays={item?.workingDays[index]}
                      img={item?.image?.length && item?.image[0]}
                      location={item?.bussinessAddress}
                      textWidth={48}
                    />
                  );
                }}
              />
            ) : (
              <View style={{flex: 0.6, justifyContent: 'center'}}>
                <AppText
                  title={'No Salons Found'}
                  textAlignment="center"
                  textFontWeight
                  textSize={2.5}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </BackgroundScreen>
  );
};

export default Home;
