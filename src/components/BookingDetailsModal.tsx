/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native'
import React from 'react'
import AppText from './AppTextComps/AppText'
import AppColors from '../utils/AppColors'
import { responsiveHeight } from '../utils/Responsive_Dimensions'
import AppButton from './AppButton'
type props = {
  heading?: string;
  btn1Title?: string;
  btn2Title?: string;
  handleBtn1Press?: () => void;
  handleBtn2Press?: () => void;
};
const BookingDetailsModal = ({ btn1Title, btn2Title, handleBtn1Press, handleBtn2Press, heading }: props) => {
  return (
    <View style={{ padding: 16, flex: 1 }}>
      <AppText
        textAlignment="center"
        title={heading}
        textColor={AppColors.BLACK}
        textSize={2.5}
        textFontWeight
      />
      <AppText
        title="Terms & Conditions"
        textColor={AppColors.BLACK}
        textSize={2.1}
        mrgnTop={2.5}
        textFontWeight
      />
      <AppText
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        textColor="#0B0C16"
        textSize={1.9}
        mrgnTop={1.5}
      />
      <View
        style={{
          marginTop: responsiveHeight(3),
          gap: responsiveHeight(2),
        }}>
        <AppButton
          title={btn1Title}
          handlePress={handleBtn1Press}
          bgColor={AppColors.WHITE}
          textColor={AppColors.BTNCOLOURS}
          borderWidth={2}
          borderColor="#425AFF"
        />
        <AppButton
          title={btn2Title}
          handlePress={handleBtn2Press}
        />
      </View>
    </View>
  )
}

export default BookingDetailsModal