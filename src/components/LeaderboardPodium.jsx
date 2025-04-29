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

const LeaderboardPodium = () => {
  const players = [
    {position: 2, score: 7567},
    {position: 1, score: 9765},
    {position: 3, score: 6674},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {players.map((player, index) => (
          <View
            key={index}
            style={[
              styles.playerContainer,
              player.position === 1 && styles.centerPlayer,
            ]}>
            {player.position === 1 && (
              <SVGXml width={'50'} height={'50'} icon={AppIcons.king} />
            )}
            <View
              style={{
                alignItems: 'center',
                top: player.position === 1 ? 0 : responsiveHeight(4),
              }}>
              {player.position !== 1 && (
                <>
                  <Text
                    style={{color: AppColors.BTNCOLOURS, fontWeight: 'bold'}}>
                    {player.position}
                  </Text>
                  <MaterialIcons
                    name={
                      player.position === 2
                        ? 'arrow-drop-up'
                        : 'arrow-drop-down'
                    }
                    size={responsiveFontSize(2.5)}
                    color={AppColors.BLACK}
                  />
                </>
              )}
              {player.position !== 1 && <LineBreak space={1} />}
              <Image
                style={[
                  styles.avatar,
                  player.position === 1 && styles.avatarLarge,
                ]}
                source={APPImages.default_user}
              />
              <Text style={styles.username}>@playername</Text>
              <Text style={styles.score}>{player.score}</Text>
            </View>
          </View>
        ))}
      </View>

      <View>
       <Image source={APPImages.counting} style={{width: responsiveWidth(90)}} />
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3),
  },
  playerContainer: {
    alignItems: 'center',
    marginHorizontal: responsiveWidth(3),
  },
  centerPlayer: {
    marginHorizontal: responsiveWidth(5),
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
