import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from '../screens/auth/Signup';

import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
const Stack = createStackNavigator();

const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Otp" component={Otp} />
    </Stack.Navigator>
  );
};

export default Auth;
