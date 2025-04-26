import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import AppText from './AppTextComps/AppText'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { responsiveFontSize, responsiveHeight } from '../utils/Responsive_Dimensions'
import AppColors from '../utils/AppColors'

const AppHeader = ({onPress, title}) => {
  return (
    <View style={{flexDirection: 'row', backgroundColor: AppColors.WHITE, gap: title ? 10 : 0, paddingTop: title ? responsiveHeight(3) : 10, paddingBottom: title ? responsiveHeight(3) : 10,  justifyContent: title ? 'flex-start' : 'space-between', alignItems: 'center', paddingVertical: responsiveHeight(2), paddingHorizontal: responsiveHeight(2)}}>
        <TouchableOpacity onPress={onPress}>
      <MaterialIcons
                      name={"arrow-back-ios"}
                      size={responsiveFontSize(2.7)}
                      color={AppColors.BLACK}
                      
                      />
        </TouchableOpacity>
      <AppText title={title} textSize={2.4} textFontWeight />
      {title ? <View /> : <TouchableOpacity style={{borderWidth: 1, padding: responsiveHeight(1.5), borderRadius: 10, borderColor: AppColors.PEACHCOLOUR}}>
      <AntDesign
                      name={"hearto"}
                      size={responsiveFontSize(2.7)}
                      color={AppColors.BLACK}
                      
                      />
        </TouchableOpacity>}
    </View>
  )
}

export default AppHeader