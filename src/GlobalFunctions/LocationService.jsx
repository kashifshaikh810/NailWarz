import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Get current location (lat/lng) and its address
 * @returns {Promise<{latitude:number, longitude:number, address:string} | null>}
 */
export const getCurrentLocationWithAddress = async () => {
  try {
    // Request location permission
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return {latitude: null, longitude: null, address: 'Location unavailable'};
      }
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth !== 'granted') {
        return {latitude: null, longitude: null, address: 'Location unavailable'};
      }
    }

    // Get current coordinates
    const position = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      });
    });

    const {latitude, longitude} = position.coords;

    // Fetch address from OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'NailWarzApp/1.0',
          'Accept-Language': 'en',
        },
      },
    );
    const json = await response.json();
    const a = json.address;

    const street =
      a.road || a.street || a.residential || a.pedestrian || a.house_number;
    const area =
      a.neighbourhood || a.suburb || a.village || a.town || a.city_district;
    const city = a.city || a.town || a.village || a.state_district;
    const state = a.state;
    const country = a.country;

    const parts = [street, area, city, state, country].filter(Boolean);
    const address = parts.slice(0, 3).join(', ');

    return {latitude, longitude, address};
  } catch (err) {
    console.log('Error fetching location:', err);
    return {latitude: null, longitude: null, address: 'Location unavailable'};
  }
};
