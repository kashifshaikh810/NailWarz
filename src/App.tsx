import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './routes/Routes';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistor, store } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Routes />
          <Toast />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
