import { View, Text } from 'react-native'
import React from 'react'
import AppColors from '../../utils/AppColors'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/Responsive_Dimensions'

type textProps = {
  title?: any
  textSize?: Number,
  textColor?: any,
  textFontWeight?: boolean,
  textAlignment?: String,
  textwidth?: number,
  borderBottomWidth?: any,
  borderBottomColor?: any,
  paddingBottom?: any,
  mrgnTop?: number,
  mrgnLeft?:number,
  numberOfLines?: number,
  styles?: object,
  onPress?: () => void;
  txtDecoration?:string;
}

const AppText = ({ title, onPress,txtDecoration, numberOfLines, styles,mrgnLeft, textSize, textColor, mrgnTop, textFontWeight, textAlignment, textwidth, borderBottomWidth, borderBottomColor, paddingBottom }: textProps) => {
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[{
        width: textwidth ? responsiveWidth(textwidth) : null,
        fontSize: textSize ? responsiveFontSize(textSize) : responsiveFontSize(1.4),
        fontWeight: textFontWeight ? "bold" : "regular",
        color: textColor ? textColor : AppColors.BLACK,
        marginTop: responsiveHeight(mrgnTop),
        marginLeft:responsiveHeight(mrgnLeft),
        textAlign: textAlignment ? textAlignment : null,
        alignSelf: textAlignment ? textAlignment : null,
        borderBottomWidth: borderBottomWidth ? borderBottomWidth : 0,
        borderBottomColor: borderBottomColor ? borderBottomColor : 0,
        paddingBottom: paddingBottom ? paddingBottom : 0,
        textDecorationLine:txtDecoration,
      }, styles]}>{title}</Text>
  );
};

export default AppText;
