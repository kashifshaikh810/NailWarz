import React from 'react'
import { View } from 'react-native'
import { responsiveHeight } from '../utils/Responsive_Dimensions'

const LineBreak = ({space}) => {
  return (
    <View style={{height: responsiveHeight(space), opacity: 0, overflow: 'visible', zIndex: 0}} />
  )
}

export default LineBreak;