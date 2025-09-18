// import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes/Routes';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistor, store } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { setupNotificationListeners } from './assets/Utils/NotificationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const App = () => {
  useEffect(() => {
    setupNotificationListeners(); // 👈 single entry
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider
            publishableKey="pk_test_51RqOmjDDujdJ0hKzkfAi12EJB6WVvYYtY1SUTME4kjdisOMNtrFCG99JNvFR8phsJ5DySlnaehCMyp6pX3L5gYip00ibakNmG3"
            merchantIdentifier="merchant.com.myapp.payment" // iOS only
            urlScheme="com.myapp" // required for 3D Secure redirects
          >
            <NavigationContainer>
              <Routes />
              <Toast />
            </NavigationContainer>
          </StripeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
