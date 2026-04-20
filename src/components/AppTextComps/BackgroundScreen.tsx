/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import AppColors from '../../utils/AppColors'
import { responsiveHeight } from '../../utils/Responsive_Dimensions'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '../../GlobalFunctions/styles'

type BgProps = {
  children: ReactNode,
  stylesPorp?: any,
  paddingTop?: number,
  padding?: number,
  bgColor?: bgColor,
}

const BackgroundScreen = ({ children, bgColor, stylesPorp, padding, paddingTop }: BgProps) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          stylesPorp,
          {
            flexGrow: 1,
            backgroundColor: bgColor ? bgColor : AppColors.WHITE,
            padding: typeof padding === 'number' ? responsiveHeight(padding) : 20,
            paddingTop: paddingTop ? responsiveHeight(paddingTop) : undefined,
            paddingBottom: responsiveHeight(10),
          },
        ]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BackgroundScreen;
