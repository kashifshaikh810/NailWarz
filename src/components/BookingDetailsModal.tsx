/* eslint-disable react-native/no-inline-styles */
import {View} from 'react-native';
import React, {ReactNode} from 'react';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import {responsiveHeight} from '../utils/Responsive_Dimensions';
import AppButton from './AppButton';
type props = {
  heading?: string;
  btn1Title?: string | ReactNode;
  btn2Title?: string;
  handleBtn1Press?: () => void;
  handleBtn2Press?: () => void;
  isCancelModal?:boolean;
};

const cancellationCopy =
  'All cancellation funds are issued as Nail Warz credit, equal to the service amount. Credits never expire and will automatically apply to your next booking. App/service charges are non-refundable.';
const rescheduleCopy =
  'Select a new date and time for this service instead of canceling. Any eligible credits can be used at checkout. App/service charges may apply.';

const BookingDetailsModal = ({
  btn1Title,
  btn2Title,
  handleBtn1Press,
  handleBtn2Press,
  heading,
  isCancelModal = true,
}: props) => {
  return (
    <View style={{padding: 16, flex: 1}}>
      <AppText
        textAlignment="center"
        title={heading}
        textColor={AppColors.BLACK}
        textSize={2.5}
        textFontWeight
      />
      <AppText
        title={isCancelModal ? cancellationCopy : rescheduleCopy}
        textColor="#0B0C16"
        textSize={1.9}
        mrgnTop={2.5}
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
        <AppButton title={btn2Title} handlePress={handleBtn2Press} />
      </View>
    </View>
  );
};

export default BookingDetailsModal;
