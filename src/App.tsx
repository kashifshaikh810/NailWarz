// import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React, {useEffect, useLayoutEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, onNavigationReady } from './utils/navigationRef';
import Routes from './routes/Routes';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistor, store } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { setupNotificationListeners } from './assets/Utils/NotificationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {ImageBackground, Platform, StyleSheet} from 'react-native';
import APPImages from './assets/APPImages';

const linking = {
  prefixes: ['nailwarz://', 'com.nailwarz://'],
  config: {
    screens: {
      Notification: 'notification',
      Main: {
        screens: {
          Home: {
            screens: {
              Notification: 'home-notification',
            },
          },
        },
      },
    },
  },
};

const PersistSplash = () => (
  <ImageBackground
    resizeMode="cover"
    source={APPImages.Splash}
    style={styles.persistSplash}
  />
);

const App = () => {
  useEffect(() => {
    setupNotificationListeners(); // 👈 single entry
  }, []);

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.stickyImmersive();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={<PersistSplash />} persistor={persistor}>
          <StripeProvider
            publishableKey="pk_test_51RqOmjDDujdJ0hKzkfAi12EJB6WVvYYtY1SUTME4kjdisOMNtrFCG99JNvFR8phsJ5DySlnaehCMyp6pX3L5gYip00ibakNmG3"
            merchantIdentifier="merchant.com.myapp.payment" // iOS only
            urlScheme="com.myapp" // required for 3D Secure redirects
          >
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
              onReady={onNavigationReady}
            >
              <Routes />
              <Toast />
            </NavigationContainer>
          </StripeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  persistSplash: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default App;
