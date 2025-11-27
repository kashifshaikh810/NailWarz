/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Image, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/main/Home';
import HomeDetails from '../screens/main/HomeDetails';
import StylistSelect from '../screens/main/StylistSelect';
import DateAndTimeSelection from '../screens/main/DateAndTimeSelection';
import BookingSummary from '../screens/main/BookingSummary';
import SelectPaymentMethod from '../screens/main/SelectPaymentMethod';
import DownloadReceipt from '../screens/main/DownloadReceipt';
import SearchLocation from '../screens/main/SearchLocation';
import MapView from '../screens/main/MapView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from '../screens/main/profile/Profile';
import Warz from '../screens/main/warz/Warz';
import Favourites from '../screens/main/favourites/Favourites';
import Booking from '../screens/main/bookings/Booking';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import APPImages from '../assets/APPImages';
import Community from '../screens/main/warz/Community';
import BattlePoll from '../screens/main/warz/BattlePoll';
import LiveVotingScores from '../screens/main/warz/LiveVotingScores';
import FinalScoreBoard from '../screens/main/warz/FinalScoreBoard';
import EditProfile from '../screens/main/profile/EditProfile';
import CreatePost from '../screens/main/warz/CreatePost';
import AllReviews from '../screens/main/AllReviews';
import SelectAnyTech from '../screens/main/SelectAnyTech';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BookingDetails from '../screens/main/bookings/BookingDetails';
import Settings from '../screens/main/Settings';
import InstructionsScreen from '../screens/main/InstructionsScreen';
import Accessebility from '../screens/main/Accessebility';
import Notification from '../screens/main/Notification';
import Wallet from '../screens/main/Wallet';
import BattleForm from '../screens/main/BattleForm';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={MyTabs} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="HomeDetails" component={HomeDetails} />
      <Stack.Screen name="StylistSelect" component={StylistSelect} />
      <Stack.Screen
        name="DateAndTimeSelection"
        component={DateAndTimeSelection}
      />
      <Stack.Screen name="BookingSummary" component={BookingSummary} />
      <Stack.Screen name="AllReviews" component={AllReviews} />
      <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
      />
      <Stack.Screen name="DownloadReceipt" component={DownloadReceipt} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="SearchLocation" component={SearchLocation} />
      <Stack.Screen name="Community" component={Community} />
      <Stack.Screen name="BattleForm" component={BattleForm} />
      <Stack.Screen name="BattlePoll" component={BattlePoll} />
      <Stack.Screen name="LiveVotingScores" component={LiveVotingScores} />
      <Stack.Screen name="FinalScoreBoard" component={FinalScoreBoard} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="MapViewScreen" component={MapView} />
      <Stack.Screen name="Wallet" component={Wallet} />
      {/* <Stack.Screen name="Profile" component={MyTabs} /> */}
      <Stack.Screen name="SelectAnyTech" component={SelectAnyTech} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="InstructionsScreen" component={InstructionsScreen} />
      <Stack.Screen name="Accessebility" component={Accessebility} />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
};

function MyTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabelStyle: {fontSize: responsiveFontSize(1.7)},
        // tabBarStyle: {
        //   height: responsiveHeight(8) + insets.bottom, // Dynamic height
        //   paddingBottom:
        //     insets.bottom > 0
        //       ? insets.bottom
        //       : Platform.OS === 'android'
        //       ? 10
        //       : 0,
        // },
        tabBarStyle: {
          // paddingBottom: insets.bottom || 10,
          height: 60 + insets.bottom, // fixed safe height
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Booking') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          if (route.name === 'Warz') {
            return (
              <Image
                source={APPImages.LOGO}
                style={{
                  width: responsiveWidth(6.5),
                  height: responsiveHeight(3.5),
                }}
              />
            );
          } else {
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Booking" component={Booking} />
      <Tab.Screen name="Warz" component={Warz} />
      <Tab.Screen name="Favorites" component={Favourites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default Main;
