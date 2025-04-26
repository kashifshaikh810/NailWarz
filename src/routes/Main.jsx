import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/main/Home';
import HomeDetails from '../screens/main/HomeDetails';
import StylistSelect from '../screens/main/StylistSelect';
import DateAndTimeSelection from '../screens/main/DateAndTimeSelection';
import BookingSummary from '../screens/main/BookingSummary';
import SelectPaymentMethod from '../screens/main/SelectPaymentMethod';
import DownloadReceipt from '../screens/main/DownloadReceipt';
import SearchLocation from '../screens/main/SearchLocation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={MyTabs} />
      <Tab.Screen name="HomeDetails" component={HomeDetails} />
      <Tab.Screen name="StylistSelect" component={StylistSelect} />
      <Tab.Screen name="DateAndTimeSelection" component={DateAndTimeSelection} />
      <Tab.Screen name="BookingSummary" component={BookingSummary} />
      <Tab.Screen name="SelectPaymentMethod" component={SelectPaymentMethod} />
      <Tab.Screen name="DownloadReceipt" component={DownloadReceipt} />
      <Tab.Screen name="SearchLocation" component={SearchLocation} />
      <Stack.Screen name="Profile" component={MyTabs} />
    </Stack.Navigator>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Home} />
    </Tab.Navigator>
  );
}

export default Main;
