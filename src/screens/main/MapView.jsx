/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import APPImages from '../../assets/APPImages';
import LineBreak from '../../components/LineBreak';
import AppText from '../../components/AppTextComps/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterModal from '../../components/FilterModal';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {getSaloons} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';
import {apiKey, ImageBaseUrl} from '../../BaseUrl';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 👈 for cross icon
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const MapViewScreen = () => {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [saloons, setSaloons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const googlePlacesRef = useRef(null);
  const [latLng, setLatLng] = useState({
    latitude: 37.4219983,
    longitude: -122.084,
  });
  console.log('salons', saloons);
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
    getSaloonsHandler();
  }, [latLng.latitude]);
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
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getSaloonsHandler = async () => {
    setSaloons(null);
    try {
      setIsLoading(true);
      const response = await getSaloons({
        latitude: latLng?.latitude,
        longitude: latLng?.longitude,
        // saloonName: searchedSalon || undefined,
        // categoryId: currentCategory?.categoryId || undefined,
      });
      console.log('reeeesss', response);
      setIsLoading(false);
      if (response.success) {
        setSaloons(response.data);
      } else {
        if (response.message === 'Salon not found') {
          return ShowToast('error', 'No Salons Found In This Area');
        }
      }
    } catch (error) {
      setIsLoading(false);
      ShowToast('error', 'Failed to fetch saloons');
      console.log('getSaloonsHandler error:', error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppHeader onPress={() => navigation.goBack()} title={'Map View'} />

      <FilterModal visible={showFilterModal} setVisible={setShowFilterModal} />

      <View
        style={{
          backgroundColor: AppColors.WHITE,
          paddingBottom: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(5),
          }}>
          {/* <AppTextInput
            containerBg={AppColors.INPUTBG}
            inputPlaceHolder={'Lakewood, California'}
            inputWidth={55}
            logo={
              <EvilIcons
                name={'location'}
                size={responsiveFontSize(2.7)}
                color={AppColors.BLUE}
              />
            }
          /> */}
          <GooglePlacesAutocomplete
            placeholder="Search"
            ref={googlePlacesRef}
            query={{
              key: apiKey, // REPLACE WITH YOUR ACTUAL API KEY
              language: 'en',
              //   types: 'geocode',
            }}
            styles={{
              textInput: {
                backgroundColor: '#f0f0f0', // ✅ BG color here
                color: '#000', // text color
                borderRadius: 8,
                paddingHorizontal: 10,
                height: 45,
              },
              description: {
                color: '#000', // suggestions text
              },
              listView: {
                backgroundColor: 'white', // dropdown bg
              },
            }}
            autoFillOnNotFound={false}
            currentLocation={false}
            currentLocationLabel="Current location"
            debounce={400}
            disableScroll={false}
            enableHighAccuracyLocation={true}
            enablePoweredByContainer={true}
            fetchDetails={true}
            isRowScrollable={true}
            keyboardShouldPersistTaps="always"
            listUnderlayColor="#c8c7cc"
            minLength={1}
            onPress={(data, details = null) => {
              if (details) {
                const lat = details.geometry.location.lat;
                const lng = details.geometry.location.lng;
                const address = details.formatted_address || data.description;
                setLatLng({latitude: lat, longitude: lng});
              }
            }}
            predefinedPlaces={[]}
            textInputProps={{}}
            timeout={20000}
            renderRightButton={() => (
              <TouchableOpacity
                onPress={() => googlePlacesRef.current?.setAddressText('')}
                style={{justifyContent: 'center', paddingHorizontal: 8}}>
                <Icon name="close" size={22} color="#000" />
              </TouchableOpacity>
            )}
            // ref={ref => {
            //   this.googlePlacesRef = ref;
            // }}
          />
          {/* <TouchableOpacity
            style={{
              justifyContent: 'center',
              borderRadius: 10,
              paddingHorizontal: responsiveWidth(3),
              borderWidth: 1,
              borderColor: AppColors.INPUTBG,
            }}
            onPress={() => setShowFilterModal(true)}>
            <MaterialCommunityIcons
              name={'tune-vertical'}
              size={responsiveFontSize(3)}
              color={AppColors.BLACK}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={{flex: 1}}>
        <MapView
          mapType="terrain"
          style={{flex: 1}}
          region={{
            latitude: latLng?.latitude,
            longitude: latLng?.longitude, // <- must be negative
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {saloons?.map((item, index) => (
            <Marker
              key={index}
              title={item?.salonName}
              coordinate={{
                latitude: item?.location?.coordinates[1],
                longitude: item?.location?.coordinates[0],
              }}
            />
          ))}
        </MapView>

        {/* <LineBreak space={4} /> */}
        {isLoading ? (
          <View
            style={{
              flex: 1,
              height: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View style={{position: 'absolute', bottom: 10}}>
            <FlatList
              data={saloons}
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{gap: 20, paddingHorizontal: 10}}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: AppColors.WHITE,
                        paddingVertical: responsiveHeight(2),
                        paddingHorizontal: responsiveWidth(4),
                        borderRadius: 15,
                      }}
                      onPress={() =>
                        navigation.navigate('HomeDetails', {saloonId: item._id})
                      }
                      // navigation.navigate('HomeDetails', { saloonId:item._id })
                    >
                      <ImageBackground
                        imageStyle={{borderRadius: 15}}
                        source={{uri: `${ImageBaseUrl}${item?.image}`}}
                        style={{
                          width: responsiveWidth(70),
                          height: responsiveHeight(15),
                          alignItems: 'flex-end',
                        }}>
                        <View
                          style={{
                            paddingHorizontal: responsiveWidth(5),
                            paddingVertical: responsiveHeight(2),
                          }}>
                          <TouchableOpacity>
                            <AntDesign
                              name={'hearto'}
                              size={responsiveFontSize(2.7)}
                              color={AppColors.WHITE}
                            />
                          </TouchableOpacity>
                        </View>
                      </ImageBackground>
                      <LineBreak space={1} />

                      <View style={{gap: 5}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                          }}>
                          <AppText
                            title={item?.salonName}
                            textColor={AppColors.BLACK}
                            textSize={2.5}
                            textFontWeight
                          />
                          <AppText
                            title="2 km"
                            textColor={AppColors.DARKGRAY}
                            textSize={2}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Ionicons
                            name={'location-outline'}
                            size={responsiveFontSize(2)}
                            color={AppColors.DARKGRAY}
                          />
                          <AppText
                            title={item?.locationName}
                            textSize={2}
                            textColor={AppColors.DARKGRAY}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Entypo
                            name={'star'}
                            size={responsiveFontSize(2.5)}
                            color={'#FFD33C'}
                          />
                          <AppText title={item?.avgRating} textSize={2} />
                          <AppText
                            title={`(${item?.totalReviews})`}
                            textSize={1.5}
                            textColor={AppColors.DARKGRAY}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MapViewScreen;
