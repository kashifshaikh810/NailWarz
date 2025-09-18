/* eslint-disable react-native/no-inline-styles */
import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppTextComps/AppText';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const InstructionsScreen = ({navigation, route}) => {
  const {type} = route?.params;
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader onPress={() => navigation.goBack()} title={type} />
        <View
          style={{
            padding: responsiveHeight(2),
            paddingTop: responsiveHeight(0.1),
            gap: responsiveHeight(2),
          }}>
          <AppText
            textSize={2}
            textColor={AppColors.txtColor}
            title="Duis aute irure dolor in reprehenderit in voluptate vel esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu"
          />
          <AppText
            textSize={2}
            textColor={AppColors.txtColor}
            title="Duis aute irure dolor in reprehenderit in volupta esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu"
          />
          <AppText
            textSize={2}
            textColor={AppColors.txtColor}
            title="Duis aute irure dolor in reprehenderit in volupt esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat."
          />
          <AppText
            textSize={2}
            textColor={AppColors.txtColor}
            title="Duis aute irure dolor in reprehenderit in volupta esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatuDuis aute irure dolor in."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InstructionsScreen;
