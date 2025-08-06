import { View, Text, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import AppColors from '../../utils/AppColors'
import { responsiveHeight } from '../../utils/Responsive_Dimensions'

type BgProps = {
  children: ReactNode,
  stylesPorp?: any,
  paddingTop?: number,
  padding?: number,
  bgColor?: bgColor,
}

const BackgroundScreen = ({ children, bgColor, stylesPorp, padding, paddingTop }: BgProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[stylesPorp, { flexGrow: 1, backgroundColor: bgColor ? bgColor : AppColors.WHITE, padding: responsiveHeight(padding) ? padding : 20, paddingTop: paddingTop ? responsiveHeight(paddingTop) : null }]}>
      {children}
    </ScrollView>
  );
};

export default BackgroundScreen;
