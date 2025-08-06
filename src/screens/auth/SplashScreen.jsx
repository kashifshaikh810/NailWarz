/* eslint-disable react-native/no-inline-styles */
import {ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import APPImages from '../../assets/APPImages';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 1500);
  }, []);
  return <ImageBackground style={{flex: 1}} source={APPImages.Splash} />;
};

export default SplashScreen;
