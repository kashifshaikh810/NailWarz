/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import LineBreak from './LineBreak';
import APPImages from '../assets/APPImages';
import SVGXml from './SVGXML';
import {AppIcons} from '../assets/Icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppColors from '../utils/AppColors';
import AppText from './AppTextComps/AppText';

const LeaderboardPodium = ({players = []}) => {
  // Only players who got votes
  const filteredPlayers = players.filter(p => p?.vote?.length > 0);

  // Sort by votes in descending order
  const sortedPlayers = [...filteredPlayers].sort(
    (a, b) => b.vote.length - a.vote.length,
  );

  // Only take top 3 players
  const topThree = sortedPlayers.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: responsiveHeight(3),
            height: responsiveHeight(20),
          }}>
          {topThree.map((player, index) => {
            const position = index + 1; // 1 = first, 2 = second, 3 = third

            return (
              <View
                key={player?._id}
                style={[
                  position === 1 && styles.firstPlace,
                  position === 2 && styles.secondPlace,
                  position === 3 && styles.thirdPlace,
                ]}>
                {position === 1 && (
                  <View style={{alignSelf: 'center',alignItems:'center'}}>
                    <AppText textFontWeight={'300'} textSize={2} title="NAIL CHAMPION"/>
                    <SVGXml width={'50'} height={'50'} icon={AppIcons.king} />
                  </View>
                )}

                <View style={{alignItems: 'center'}}>
                  {position !== 1 && (
                    <>
                      <Text
                        style={{
                          color: AppColors.BTNCOLOURS,
                          fontWeight: 'bold',
                        }}>
                        {position}
                      </Text>
                      <MaterialIcons
                        name={
                          position === 2 ? 'arrow-drop-up' : 'arrow-drop-down'
                        }
                        size={responsiveFontSize(2.5)}
                        color={AppColors.BLACK}
                      />
                    </>
                  )}
                  {position !== 1 && <LineBreak space={1} />}

                  <Image
                    style={[
                      styles.avatar,
                      position === 1 && styles.avatarLarge, // bigger avatar for 1st place
                    ]}
                    source={APPImages.default_user}
                  />

                  <Text style={styles.username}>{player?.salonName}</Text>
                  <Text style={styles.score}>{player?.vote?.length}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View>
        <Image
          source={APPImages.counting}
          style={{width: responsiveWidth(90), alignSelf: 'center'}}
        />
      </View>
    </View>
  );
};


export default LeaderboardPodium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    width: responsiveWidth(90),

    marginBottom: responsiveHeight(2),
  },
  playerContainer: {
    alignItems: 'center',
    width: responsiveWidth(90),
    marginHorizontal: responsiveWidth(3),
  },
  firstPlace: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    left: responsiveHeight(1.2),
    bottom: responsiveHeight(0.5),
  },
  secondPlace: {
    position: 'absolute',
    bottom: responsiveHeight(-4),
    left: responsiveHeight(3.5),
  },
  thirdPlace: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: responsiveHeight(-4),
    right: 10,
  },
  crown: {
    fontSize: 20,
    position: 'absolute',
    top: responsiveHeight(-4),
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginBottom: responsiveHeight(1),
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  username: {
    fontSize: responsiveFontSize(1),
    fontWeight: 'bold',
  },
  score: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});
