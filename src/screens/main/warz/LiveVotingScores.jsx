/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import APPImages from '../../../assets/APPImages';
import {
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import LineBreak from '../../../components/LineBreak';
import PointesProfile from '../../../components/PointesProfile';

const voters = [
  {id: 1, profImg: APPImages.nailsTwo, username: 'Alicia', numOfScore: 7050},
  {id: 2, profImg: APPImages.nailsTwo, username: 'John', numOfScore: 6930},
  {id: 3, profImg: APPImages.nailsTwo, username: 'Alex', numOfScore: 6320},
  {id: 4, profImg: APPImages.nailsTwo, username: 'Clinton', numOfScore: 5990},
  {id: 5, profImg: APPImages.nailsTwo, username: 'Olivia', numOfScore: 4870},
  {id: 6, profImg: APPImages.nailsTwo, username: 'Smith', numOfScore: 3750},
  {id: 7, profImg: APPImages.nailsTwo, username: 'Mike', numOfScore: 2341},
];

const LiveVotingScores = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title={'LIVE VOTING SCORES'}
        isTextAlignCentered={true}
      />

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
      </View>

      <LineBreak space={4} />
    </ScrollView>
  );
};

export default LiveVotingScores;
