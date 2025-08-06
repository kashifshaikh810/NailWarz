import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AppColors from '../utils/AppColors'
import AppText from './AppTextComps/AppText'
import { responsiveHeight } from '../utils/Responsive_Dimensions'


type props = {
    title?: any, 
    bgColor?: any, 
    logo?:any,
    txtColor?:any 

}
const SocialAuthButton = ({title,bgColor,logo,txtColor}: props) => {
  return (
    <TouchableOpacity style={{backgroundColor:bgColor, alignItems:'center', justifyContent:'center', padding:15, borderRadius:responsiveHeight(1.5), flexDirection:'row', gap:10, }}>
        {
            logo
        }
      <AppText textColor={txtColor ? txtColor : AppColors.WHITE} textSize={2} title={title} textFontWeight />
    </TouchableOpacity>
  )
}

export default SocialAuthButton