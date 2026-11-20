/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const InstructionsScreen = ({navigation, route}) => {
  const {type} = route?.params;
  const insets = useSafeAreaInsets();
  const apiEndpoint =
    type === 'Privacy Policy'
      ? 'https://nail-warz-demo.vercel.app/privacy_policy'
      : type === 'Terms & Conditions'
      ? 'https://nail-warz-demo.vercel.app/terms_and_conditions'
      : type === 'Warzone Rules'
      ? 'https://nail-warz-demo.vercel.app/warzone'
      : 'https://nail-warz-demo.vercel.app/cookie_policy';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <AppHeader onPress={() => navigation.goBack()} title={type} />

      <View style={{flex: 1, paddingBottom: 60 + insets.bottom}}>
        <WebView
          source={{uri: apiEndpoint}}
          style={{flex: 1}}
          contentInset={{bottom: 24}}
          scrollIndicatorInsets={{bottom: 24}}
        />
      </View>
    </SafeAreaView>
  );
};

export default InstructionsScreen;
