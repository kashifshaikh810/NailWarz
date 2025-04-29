/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';

const FractionalProgressBar = ({
  current = 4,
  total = 10,
  height = responsiveHeight(2.6),
  backgroundColor = AppColors.LIGHTGRAY,
  progressColor = AppColors.BTNCOLOURS,
  textColor = AppColors.WHITE,
  fontSize = responsiveFontSize(1.8),
}) => {
  const progress = (current / total) * 100;

  return (
    <>
      <View style={{alignItems: 'flex-end'}}>
        <AppText
          title={`${current}/${total}`}
          textColor={AppColors.BLACK}
          textSize={2.1}
          textFontWeight
        />
      </View>
      <View style={[styles.container, {height, backgroundColor}]}>
        <View
          style={[
            styles.progress,
            {width: `${progress}%`, backgroundColor: progressColor},
          ]}>
          <Text
            style={{
              color: textColor,
              fontSize,
              fontWeight: 'bold',
              textAlign: 'right',
              paddingHorizontal: responsiveWidth(3),
            }}>
            {`${current}`}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    justifyContent: 'center',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
});

export default FractionalProgressBar;
