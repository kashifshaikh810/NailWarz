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
import {getAllCategories, getSaloons} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';

const Home = () => {
  const [serviceSelected, setServiceSelect] = useState(0);
  // const Servies = [
  //   {id: 1, name: 'Dip Powder Nails', icon: APPImages.COMB},
  //   {id: 2, name: 'Gel Manicure/Pedicure', icon: APPImages.FACIAL},
  // ];
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    categoryId: '',
    categoryName: '',
  });
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [address, setAddress] = useState('');
  const [searchedSalon, setSearchedSalon] = useState();
  const [latLng, setLatLng] = useState({
    latitude: 37.4219983,
    longitude: -122.084,
  });
  const [saloons, setSaloons] = useState([]);
  console.log('latLng', latLng);
  console.log('currentCategory', currentCategory.categoryId);
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
  const fetchAddressFromCoords = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latLng.latitude}&lon=${latLng.longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'ReactNativeApp', // required by Nominatim
          },
        },
      );
      const json = await response.json();
      const address = json.display_name;
      console.log('Address:', address);
      setAddress(address);
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };
  useEffect(() => {
    // const requestLocationPermission = async () => {
    //   if (Platform.OS === 'android') {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       getCurrentLocation();
    //     } else {
    //       console.log('Location permission denied');
    //     }
    //   } else {
    //     getCurrentLocation();
    //   }
    // };

    // const getCurrentLocation = () => {
    //   Geolocation.getCurrentPosition(
    //     position => {
    //       const {latitude, longitude} = position.coords;
    //       setLatLng({latitude, longitude});
    //       fetchAddressFromCoords(latitude, longitude); // Get address
    //     },
    //     error => {
    //       console.log('Location error:', error.message);
    //     },
    //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    //   );
    // };

    fetchAddressFromCoords();
    // requestLocationPermission();
  }, []);
  useEffect(() => {
    getAllCategoriesHandler();
  }, []);

  const getSaloonsHandler = async () => {
    try {
      setIsLoading2(true);
      const response = await getSaloons({
        latitude: latLng.latitude,
        longitude: latLng.longitude,
        saloonName: searchedSalon || undefined,
        categoryId: currentCategory?.categoryId || undefined,
      });
      setIsLoading2(false);

      if (response) {
        setSaloons(response.data);
      }
    } catch (error) {
      setIsLoading2(false);
      ShowToast('error', 'Failed to fetch saloons');
      console.log('getSaloonsHandler error:', error);
    }
  };

  useEffect(() => {
    if (latLng.latitude && latLng.longitude) {
      getSaloonsHandler();
    }
  }, [latLng]);
  const handleSearch = () => {
    if (searchedSalon?.trim()?.length > 0) {
      getSaloonsHandler();
    }
  };
  useEffect(() => {
    getSaloonsHandler();
  }, [currentCategory]);
  useEffect(() => {
    handleSearch();
  }, [searchedSalon]);
  return (
    <BackgroundScreen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          // onPress={() => navigation.navigate('SearchLocation')}
        >
          <EvilIcons
            name={'location'}
            color={AppColors.BLUE}
            size={responsiveFontSize(5)}
          />
          <View>
            <AppText title="Location" textSize={2} />
            <AppText
              title={address}
              textwidth={50}
              numberOfLines={2}
              textSize={1.9}
              textFontWeight
            />
          </View>
        </TouchableOpacity>

        <Ionicons
          name={'notifications-outline'}
          size={responsiveFontSize(3)}
          color={AppColors.BLACK}
        />
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
              overflow: 'hidden',
              padding: 20,
              marginTop: 20,
            }}>
            <LinearGradient
              colors={[
                AppColors.WHITE,
                AppColors.BLUE,
                AppColors.BLUE,
                AppColors.BLUE,
              ]}
              end={{x: 0, y: 1}}
              style={{
                position: 'absolute',
                zIndex: 1,
                width: responsiveWidth(90),
                height: responsiveHeight(20),
                opacity: 0.5,
              }}
            />
            <View style={{position: 'absolute', zIndex: 2, padding: 20}}>
              <AppText
                title="Morning Special!"
                textSize={2}
                textFontWeight
                textColor={AppColors.WHITE}
              />
              <AppText
                title="Get 20% Off"
                textSize={3}
                textFontWeight
                textColor={AppColors.WHITE}
              />
              <AppText
                title="On All Nail Service Between 9-10 AM."
                textSize={1.5}
                textColor={AppColors.WHITE}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.WHITE,
                  alignSelf: 'flex-start',
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <AppText
                  title="Book Now"
                  textColor={AppColors.BLACK}
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
                textSize={3}
                textFontWeight
              />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FlatList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{gap: 10}}
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
                        }}>
                        {/* <Image
                    source={item.icon}
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                  /> */}
                        <AppText
                          title={item?.categoryName}
                          textSize={2}
                          textColor={logic ? AppColors.WHITE : AppColors.BLACK}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <AppText
              title="Nearby Salons"
              textColor={AppColors.BLACK}
              textSize={3}
              textFontWeight
            />

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
              <Entypo
                name={'location'}
                color={AppColors.BLUE}
                size={responsiveFontSize(2)}
              />
              {/* <TouchableOpacity onPress={() => navigation.navigate('MapView')}> */}
              <TouchableOpacity>
                <AppText
                  title="View on Map"
                  textColor={AppColors.BLUE}
                  textSize={2}
                />
              </TouchableOpacity>
            </View>
          </View>
          {isLoading2 ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
            </View>
          ) : saloons.length > 0 ? (
            <FlatList
              data={saloons}
              contentContainerStyle={{gap: 10}}
              renderItem={({item}) => {
                return (
                  <SaloonsCard
                    title={item?.salonName}
                    KM={'km'}
                    saloonId={item?._id}
                    Rating={item?.avgRating}
                    TotalNoOfRating={item?.totalReviews}
                    img={item?.image[0]}
                    location={item?.location?.locationName}
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
      )}
    </BackgroundScreen>
  );
};

export default Home;
