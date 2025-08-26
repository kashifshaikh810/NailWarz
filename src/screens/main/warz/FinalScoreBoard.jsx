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

const FinalScoreBoard = ({route}) => {
  const navigation = useNavigation();
  const {battleId} = route?.params;
  console.log('winner', battleId.winner);

  // const sortedSalons = [...battleId?.salons].sort(
  //   (a, b) => b?.vote?.length - a?.vote?.length,
  // );

  // const topThree = sortedSalons.slice(0, 3);
  // const rest = sortedSalons.slice(3);
  let sortedSalons = [...battleId?.salons].sort(
    (a, b) => b?.vote?.length - a?.vote?.length,
  );

  // ✅ If admin declared winner
  if (battleId?.winner) {
    const winnerSalon = sortedSalons.find(s => s._id === battleId.winner);

    if (winnerSalon) {
      // Remove winner from current list
      sortedSalons = sortedSalons.filter(s => s._id !== battleId.winner);

      // Put winner at the top
      sortedSalons.unshift(winnerSalon);
    }
  }

  const topThree = sortedSalons.slice(0, 3);
  const rest = sortedSalons.slice(3);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title={'FINAL SCOREBOARD'}
        isTextAlignCentered={true}
      />
      <View>
        <LeaderboardPodium players={topThree} />
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(3),
          marginTop: responsiveWidth(4),
        }}>
        <FlatList
          data={rest}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={{
            borderWidth: 1,
            borderColor: AppColors.PEACHCOLOUR,
            borderRadius: 7,
          }}
          renderItem={({item, index}) => (
            <PointesProfile item={item} index={index + 4} /> // start from 4
          )}
        />

        <LineBreak space={2} />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
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
      </View>
      <LineBreak space={2} />
    </ScrollView>
  );
};

export default FinalScoreBoard;
