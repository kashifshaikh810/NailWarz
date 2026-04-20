/* eslint-disable react-native/no-inline-styles */
import {View, ScrollView, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../components/AppHeader';
import AppColors from '../../utils/AppColors';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import {WebView} from 'react-native-webview';

const InstructionsScreen = ({navigation, route}) => {
  const {type} = route?.params;
  const apiEndpoint =
    type === 'Privacy Policy'
      ? 'https://nail-warz-demo.vercel.app/privacy_policy'
      : type === 'Terms & Conditions'
      ? 'https://nail-warz-demo.vercel.app/terms_and_conditions'
      : type === 'Warzone Rules'
      ? 'https://nail-warz-demo.vercel.app/warzone_rules'
      : 'https://nail-warz-demo.vercel.app/cookie_policy';
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <AppHeader onPress={() => navigation.goBack()} title={type} />

      <View style={{flex: 1}}>
        {/* {loading ? (
          <View
            style={{
              flex: 0.9,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : ( */}
          <WebView
            source={{uri: apiEndpoint}}
            style={{flex: 1}}
            onLoadEnd={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        {/* // )} */}
      </View>
    </SafeAreaView>
  );
};

export default InstructionsScreen;
