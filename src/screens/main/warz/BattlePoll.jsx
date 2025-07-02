/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
import {ImageBaseUrl} from '../../../BaseUrl';
import {addVote, getPostById} from '../../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const yesOrNo = [
  {id: 1, title: 'Yes'},
  {id: 2, title: 'No'},
];

const BattlePoll = ({navigation, route}) => {
  const [isSelectedYesOrNo, setIsSelectedYesOrNo] = useState('');
  const {userData} = useSelector(state => state.user);

  const {_id} = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log('data', data.Voting);
  useEffect(() => {
    if (data?.Voting?.length) {
      const myVote = data.Voting.find(
        vote => vote.voter_id?._id === userData._id,
      );

      if (myVote) {
        if (myVote.vote === 'Yes') {
          setIsSelectedYesOrNo('Yes');
        } else if (myVote.vote === 'No') {
          setIsSelectedYesOrNo('No');
        }
      }
    }
  }, [data]);
  const getPostByIdHandler = async () => {
    setPostLoading(true);
    const response = await getPostById(_id);
    setPostLoading(false);
    setData(response.data);
  };
  console.log('isSelectedYesOrNo', isSelectedYesOrNo);

  useEffect(() => {
    getPostByIdHandler();
  }, []);
  const totalYesVotes =
    data?.Voting?.filter(item => item.vote === 'Yes').length || 0;
  console.log('totalYesVotes', totalYesVotes);
  const addVoteHandler = async selectedValue => {
    console.log('valye ise selected', selectedValue);
    if (!selectedValue) {
      return;
    }
    setIsLoading(true);
    const response = await addVote(userData?._id, data?._id, selectedValue);
    if (response.success) {
      getPostByIdHandler();
    }
    setIsLoading(false);
  };
  // useEffect(() => {
  //   if (isSelectedYesOrNo.id === 1 || isSelectedYesOrNo.id === 2) {
  //     addVoteHandler();
  //   }
  // }, [isSelectedYesOrNo]);

  return (
    <View style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={Colors.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{flex: 1}}>
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
            <FractionalProgressBar
              current={totalYesVotes}
              total={data?.Voting?.length}
            />

            <LineBreak space={2} />

            <Image
              source={{uri: `${ImageBaseUrl}${data?.Post_Image}`}}
              style={{
                width: responsiveWidth(92),
                height: responsiveHeight(30),
                borderRadius: 7,
              }}
            />

            <LineBreak space={2} />

            <AppText
              title={data?.Post_Caption}
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
                    onPress={() => {
                      setIsSelectedYesOrNo(item.title);
                      addVoteHandler(item.title);
                    }}>
                    <Fontisto
                      name={
                        isSelectedYesOrNo === item.title
                          ? 'radio-btn-active'
                          : 'radio-btn-passive'
                      }
                      size={responsiveFontSize(2.2)}
                      color={
                        isSelectedYesOrNo === item.title
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
            <AppButton
              title={'Show Results'}
              // title={
              //   isLoading ? (
              //     <ActivityIndicator size={'large'} color={AppColors.WHITE} />
              //   ) : (
              //     'Add Vote'
              //   )
              // }
              handlePress={() => {
                navigation.navigate('LiveVotingScores', {data: data?.Voting});
                // if (isSelectedYesOrNo.id === 1) {
                // }
                // else if (isSelectedYesOrNo.id === 2) {
                //   navigation.navigate('FinalScoreBoard');
                // }
                // else {
                //   Alert.alert('Action not allowed until you vote.');
                // }
              }}
            />
          </View>

          <LineBreak space={3} />
        </View>
      )}
    </View>
  );
};

export default BattlePoll;
