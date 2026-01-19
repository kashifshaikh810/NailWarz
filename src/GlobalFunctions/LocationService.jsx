import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/**
 * Get current location (lat/lng) and its address
 * @returns {Promise<{latitude:number, longitude:number, address:string} | null>}
 */
export const getCurrentLocationWithAddress = async () => {
  try {
    // Request location permission
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return null;
      }
    }

    // Get current coordinates
    const position = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });

    const { latitude, longitude } = position.coords;

    // Fetch address from OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { 'User-Agent': 'ReactNativeApp' } }
    );
    const json = await response.json();
    const a = json.address;

    const street =
      a.road || a.street || a.residential || a.pedestrian || a.house_number;
    const area = a.neighbourhood || a.suburb || a.village || a.town || a.city_district;
    const city = a.city || a.town || a.village || a.state_district;
    const state = a.state;
    const country = a.country;

    const parts = [street, area, city, state, country].filter(Boolean);
    const address = parts.slice(0, 3).join(', '); // Short address

    return { latitude, longitude, address };
  } catch (err) {
    console.log('Error fetching location:', err);
    return null;
  }
};
