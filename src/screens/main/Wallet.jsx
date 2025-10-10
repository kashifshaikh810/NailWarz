/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import AppButton from '../../components/AppButton';
import {getWalletByUserId, payWithWallet} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {ShowToast} from '../../GlobalFunctions/auth';

const Wallet = ({navigation, route}) => {
  const {token} = useSelector(state => state.user);
  const [walletDetails, setWalletDetails] = useState();
  const {bookingId, price, userId} = route?.params;
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log('walletDetails', walletDetails);
  const getWalletHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getWalletByUserId(token);
      setWalletDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const payWithWalletHandler = async () => {
    setPaymentLoading(true);
    try {
      const response = await payWithWallet(userId, bookingId, price);
      if (response.success) {
        ShowToast('success', response.message);
        getWalletHandler();
      } else {
        ShowToast('error', response.message);
      }
      console.log('response', response);
      setPaymentLoading(false);
    } catch (error) {
      ShowToast('error', error?.response?.data?.message);
      setPaymentLoading(false);
    }
  };
  useEffect(() => {
    getWalletHandler();
  }, []);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader onPress={() => navigation.goBack()} title="Wallet" />
        {isLoading ? (
          <View style={{flex: 0.9, justifyContent: 'center'}}>
            <ActivityIndicator size={45} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View style={{padding: responsiveHeight(2)}}>
            <View
              style={{
                backgroundColor: AppColors.WHITE,
                padding: responsiveHeight(2.5),
                borderRadius: responsiveHeight(2),
                elevation: 5,
              }}>
              <AppText
                title="Current Balance"
                textSize={2.2}
                textColor="#626C72"
              />
              <AppText
                mrgnTop={0.5}
                title={`$ ${walletDetails?.balance}.00`}
                textSize={3.5}
                textFontWeight
              />
            </View>
            <AppButton
              handlePress={payWithWalletHandler}
              style={{
                marginTop: responsiveHeight(5),
                paddingVertical: responsiveHeight(2),
              }}
              title={
                paymentLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Pay Now'
                )
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wallet;
