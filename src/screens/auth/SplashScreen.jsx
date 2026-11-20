import {ImageBackground, StatusBar, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import APPImages from '../../assets/APPImages';
import AppColors from '../../utils/AppColors';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        resizeMode="cover"
        style={styles.splash}
        source={APPImages.Splash}
      />
    </>
  );
};

const styles = StyleSheet.create({
  splash: {
    backgroundColor: AppColors.BTNCOLOURS,
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default SplashScreen;
