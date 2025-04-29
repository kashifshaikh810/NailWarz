/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity, Alert} from 'react-native';
import AppColors from '../../../utils/AppColors';
import AppHeader from '../../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import FractionalProgressBar from '../../../components/ProgressBar';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import APPImages from '../../../assets/APPImages';
import AppButton from '../../../components/AppButton';
import Fontisto from 'react-native-vector-icons/Fontisto';

const yesOrNo = [
  {id: 1, title: 'Yes'},
  {id: 2, title: 'No'},
];

const BattlePoll = () => {
  const navigation = useNavigation();
  const [isSelectedYesOrNo, setIsSelectedYesOrNo] = useState({id: 0});

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title={'BATTLE POLL'}
        isTextAlignCentered={true}
      />

      <View
        style={{
          paddingHorizontal: responsiveWidth(4),
          paddingVertical: responsiveHeight(1),
        }}>
        <FractionalProgressBar current={4} total={10} />

        <LineBreak space={2} />

        <Image
          source={APPImages.nailsTwo}
          style={{
            width: responsiveWidth(92),
            height: responsiveHeight(30),
            borderRadius: 7,
          }}
        />

        <LineBreak space={2} />

        <AppText
          title="You are Voting for this NAIL WARRIOR"
          textColor={AppColors.BLACK}
          textSize={1.8}
        />

        <LineBreak space={2} />

        <FlatList
          data={yesOrNo}
          contentContainerStyle={{gap: 10}}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: AppColors.DARKGRAY,
                  paddingHorizontal: responsiveWidth(3),
                  paddingVertical: responsiveHeight(1),
                  borderRadius: 7,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
                onPress={() => setIsSelectedYesOrNo({id: item.id})}>
                <Fontisto
                  name={
                    isSelectedYesOrNo.id === item.id
                      ? 'radio-btn-active'
                      : 'radio-btn-passive'
                  }
                  size={responsiveFontSize(2.2)}
                  color={
                    isSelectedYesOrNo.id === item.id
                      ? AppColors.BTNCOLOURS
                      : AppColors.DARKGRAY
                  }
                />
                <AppText
                  title={item.title}
                  textColor={AppColors.BLACK}
                  textSize={1.9}
                  textFontWeight
                />
              </TouchableOpacity>
            );
          }}
        />

        <LineBreak space={2} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: responsiveWidth(4),
        }}>
        <AppButton title={`Show Results`} handlePress={() => {
          if(isSelectedYesOrNo.id === 1){
            navigation.navigate('LiveVotingScores');
          }else if(isSelectedYesOrNo.id === 2){
            navigation.navigate('FinalScoreBoard');
          }else{
            Alert.alert("Action not allowed until you vote.")
          }
        }} />
      </View>

      <LineBreak space={3} />
    </View>
  );
};

export default BattlePoll;
