/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import LeaderboardPodium from '../../../components/LeaderboardPodium';
import APPImages from '../../../assets/APPImages';
import PointesProfile from '../../../components/PointesProfile';
import {responsiveWidth} from '../../../utils/Responsive_Dimensions';
import AppButton from '../../../components/AppButton';
import LineBreak from '../../../components/LineBreak';

const voters = [
  {id: 4, profImg: APPImages.nailsTwo, username: 'Clinton', numOfScore: 5990},
  {id: 5, profImg: APPImages.nailsTwo, username: 'Olivia', numOfScore: 4870},
  {id: 6, profImg: APPImages.nailsTwo, username: 'Smith', numOfScore: 3750},
  {id: 7, profImg: APPImages.nailsTwo, username: 'Mike', numOfScore: 2341},
];

const FinalScoreBoard = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title={'FINAL SCOREBOARD'}
        isTextAlignCentered={true}
      />

      <LeaderboardPodium />

      <View style={{paddingHorizontal: responsiveWidth(3)}}>
        <FlatList
          data={voters}
          contentContainerStyle={{
            borderWidth: 1,
            borderColor: AppColors.PEACHCOLOUR,
            borderRadius: 7,
          }}
          renderItem={({item}) => {
            return <PointesProfile item={item} />;
          }}
        />

        <LineBreak space={2} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: responsiveWidth(45)}}>
            <AppButton
              title="Save"
              handlePress={() => navigation.goBack()}
              //   bgColor={AppColors.DARKGRAY}
              //   textColor={AppColors.WHITE}
            />
          </View>
          <View style={{width: responsiveWidth(45)}}>
            <AppButton
              title="Share"
              handlePress={() => navigation.goBack()}
              //   bgColor={AppColors.DARKGRAY}
              //   textColor={AppColors.WHITE}
            />
          </View>
        </View>
      </View>
      <LineBreak space={2} />
    </ScrollView>
  );
};

export default FinalScoreBoard;
