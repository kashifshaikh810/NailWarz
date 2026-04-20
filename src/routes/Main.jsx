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
import AddDispute from '../screens/main/bookings/AddDispute';
import ViewDispute from '../screens/main/bookings/ViewDispute';
import Settings from '../screens/main/Settings';
import InstructionsScreen from '../screens/main/InstructionsScreen';
import Accessebility from '../screens/main/Accessebility';
import Notification from '../screens/main/Notification';
import Wallet from '../screens/main/Wallet';
import BattleForm from '../screens/main/BattleForm';

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const BookingStack = createStackNavigator();
const WarzStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="HomeDetails" component={HomeDetails} />
      <HomeStack.Screen name="StylistSelect" component={StylistSelect} />
      <HomeStack.Screen
        name="DateAndTimeSelection"
        component={DateAndTimeSelection}
      />
      <HomeStack.Screen name="BookingSummary" component={BookingSummary} />
      <HomeStack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
      />
      <HomeStack.Screen name="DownloadReceipt" component={DownloadReceipt} />
      <HomeStack.Screen name="SearchLocation" component={SearchLocation} />
      <HomeStack.Screen name="MapViewScreen" component={MapView} />
      <HomeStack.Screen name="AllReviews" component={AllReviews} />
      <HomeStack.Screen name="SelectAnyTech" component={SelectAnyTech} />
      <HomeStack.Screen name="Notification" component={Notification} />
      <WarzStack.Screen name="BattleForm" component={BattleForm} />
    </HomeStack.Navigator>
  );
}

function BookingStackScreen() {
  return (
    <BookingStack.Navigator screenOptions={{headerShown: false}}>
      <BookingStack.Screen name="Booking" component={Booking} />
      <BookingStack.Screen name="BookingDetails" component={BookingDetails} />
      <BookingStack.Screen name="AddDispute" component={AddDispute} />
      <BookingStack.Screen name="ViewDispute" component={ViewDispute} />
      <BookingStack.Screen name="StylistSelect" component={StylistSelect} />
      <BookingStack.Screen
        name="DateAndTimeSelection"
        component={DateAndTimeSelection}
      />
      <BookingStack.Screen name="BookingSummary" component={BookingSummary} />
      <BookingStack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
      />
      <BookingStack.Screen name="DownloadReceipt" component={DownloadReceipt} />
      <BookingStack.Screen name="SelectAnyTech" component={SelectAnyTech} />
    </BookingStack.Navigator>
  );
}

function WarzStackScreen() {
  return (
    <WarzStack.Navigator screenOptions={{headerShown: false}}>
      <WarzStack.Screen name="Warz" component={Warz} />
      <WarzStack.Screen name="Community" component={Community} />
      <WarzStack.Screen name="BattleForm" component={BattleForm} />
      <WarzStack.Screen name="BattlePoll" component={BattlePoll} />
      <WarzStack.Screen name="LiveVotingScores" component={LiveVotingScores} />
      <WarzStack.Screen name="FinalScoreBoard" component={FinalScoreBoard} />
      <WarzStack.Screen name="CreatePost" component={CreatePost} />
    </WarzStack.Navigator>
  );
}

function FavoritesStackScreen() {
  return (
    <FavoritesStack.Navigator screenOptions={{headerShown: false}}>
      <FavoritesStack.Screen name="Favorites" component={Favourites} />
      <FavoritesStack.Screen name="HomeDetails" component={HomeDetails} />
    </FavoritesStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="Wallet" component={Wallet} />
      <ProfileStack.Screen name="Settings" component={Settings} />
      <ProfileStack.Screen
        name="InstructionsScreen"
        component={InstructionsScreen}
      />
      <ProfileStack.Screen name="Accessebility" component={Accessebility} />
      <ProfileStack.Screen name="Notification" component={Notification} />
    </ProfileStack.Navigator>
  );
}

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
          position: 'absolute',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
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
      })}
      sceneContainerStyle={{
        // 60 = base tab bar height. SafeAreaView in each screen naturally adds insets.bottom,
        // so together they equal the full tab bar height (60 + insets.bottom).
        // This prevents content hiding behind the absolute-positioned tab bar with zero extra whitespace.
        paddingBottom: 60,
        backgroundColor: '#fff',
      }}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Booking" component={BookingStackScreen} />
      <Tab.Screen name="Warz" component={WarzStackScreen} />
      <Tab.Screen name="Favorites" component={FavoritesStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}

export default function Main() {
  return (
    <SafeAreaProvider>
      <MyTabs />
    </SafeAreaProvider>
  );
}
