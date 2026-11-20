import {TouchableOpacity, View} from 'react-native'
import React from 'react'
import AppColors from '../utils/AppColors'
import AppText from './AppTextComps/AppText'
import {responsiveHeight, responsiveWidth} from '../utils/Responsive_Dimensions'


type props = {
  title?: any,
  bgColor?: any,
  logo?: any,
  txtColor?: any,
  onPress?:()=>void;
  disabled?: boolean;

}
const SocialAuthButton = ({ title, bgColor, logo, txtColor, onPress, disabled }: props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: responsiveHeight(6.5),
        paddingVertical: responsiveHeight(1.4),
        paddingHorizontal: responsiveWidth(4),
        borderRadius: responsiveHeight(1.5),
        flexDirection: 'row',
        opacity: disabled ? 0.8 : 1,
      }}>
      <View
        style={{
          width: responsiveWidth(8),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {logo}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: responsiveWidth(8),
        }}>
        {React.isValidElement(title) ? (
          title
        ) : (
          <AppText
            textColor={txtColor ? txtColor : AppColors.WHITE}
            textSize={2}
            title={title}
            textFontWeight
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

export default SocialAuthButton
