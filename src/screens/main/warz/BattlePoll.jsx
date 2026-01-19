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
  ScrollView,
  Platform,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ImageBaseUrl} from '../../../BaseUrl';
import {addVote, getBattleById, getPostById} from '../../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ShowToast} from '../../../GlobalFunctions/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';

const BattlePoll = ({navigation, route}) => {
  const [isSelectedYesOrNo, setIsSelectedYesOrNo] = useState('');
  const {userData} = useSelector(state => state.user);
  const [selectedSalon, setSelectedSalon] = useState();
  const {battleId} = route?.params;
  const [participantId, setParticipantId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  console.log('userData._id', userData._id);
  console.log('data', data);
  // useEffect(() => {
  //   if (data?.Voting?.length) {
  //     const myVote = data.Voting.find(
  //       vote => vote.voter_id?._id === userData._id,
  //     );

  //     if (myVote) {
  //       if (myVote.vote === 'Yes') {
  //         setIsSelectedYesOrNo('Yes');
  //       } else if (myVote.vote === 'No') {
  //         setIsSelectedYesOrNo('No');
  //       }
  //     }
  //   }
  // }, [data]);
  const getBattleByIdHandler = async (showLoader = true) => {
    showLoader ? setIsLoading(true) : null;
    const response = await getBattleById(battleId._id);
    console.log('ress', response);
    showLoader ? setIsLoading(false) : null;
    setData(response.data.participants);
  };

  console.log('participantId===', participantId);
  const addVoteHandler = async () => {
    setVoteLoading(true);
    try {
      const response = await addVote(
        battleId._id,
        participantId,
        userData?._id,
      );
      if (response?.success) {
        ShowToast('success', response.message);
        // setParticipantId(undefined);
        getBattleByIdHandler(false);
      }
      setVoteLoading(false);
      console.log('response', response);
    } catch (error) {
      setVoteLoading(false);
      return ShowToast('error', error?.response?.data?.message);
    }
  };
  console.log('isSelectedYesOrNo', isSelectedYesOrNo);

  useEffect(() => {
    getBattleByIdHandler();
  }, []);
  useEffect(() => {
    // Find the participant that user already voted for
    const votedParticipant = data?.find(item =>
      item?.vote?.includes(userData?._id),
    );
    if (votedParticipant) {
      setParticipantId(votedParticipant.participant._id); // ✅ Corrected
    } else {
      // ✅ IMPORTANT: vote removed case
      setParticipantId(undefined);
    }
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={Colors.BTNCOLOURS} />
        </View>
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              padding: Platform.OS === 'android' ? responsiveHeight(2) : null,
              paddingHorizontal:
                Platform.OS === 'ios' ? responsiveHeight(2) : null,
              paddingBottom: responsiveHeight(10),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons
                  name={'arrow-back-ios'}
                  size={responsiveFontSize(2.7)}
                  color="red"
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  gap: responsiveHeight(1.5),
                  alignItems: 'center',
                  alignSelf: 'center',
                  right: responsiveHeight(1),
                  // marginTop: responsiveHeight(2),
                }}>
                <Image
                  source={APPImages.logoSmall}
                  style={{
                    alignSelf: 'flex-end',
                    height: responsiveHeight(8),
                    width: responsiveWidth(13),
                  }}
                  resizeMode="contain"
                />
                <AppText
                  textSize={2}
                  textColor="red"
                  textFontWeight={'bold'}
                  title="Vote Nail Warz"
                />
              </View>
              <AppText
                onPress={() => navigation.navigate('LiveVotingScores', {data})}
                title="Poll"
                textSize={2}
              />
            </View>
            <AppText
              textColor="#0B0C16"
              title="Vote now for the next Nail Champion."
              textSize={2}
              textAlignment="center"
              mrgnTop={2}
              textFontWeight="500"
            />
            <AppText
              textColor="#0B0C16"
              title="May the best set win!"
              textAlignment="center"
              textSize={2}
              // mrgnTop={2}
              textFontWeight="500"
            />
            <View>
              <FlatList
                contentContainerStyle={{
                  gap: responsiveHeight(2),
                  marginTop: responsiveHeight(2),
                  margin: responsiveHeight(1),
                }}
                data={data}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        backgroundColor: AppColors.WHITE,
                        padding: responsiveHeight(2),
                        borderRadius: responsiveHeight(2),
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.15,
                        shadowRadius: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <AppText
                          textFontWeight="bold"
                          title={item?.participant?.name}
                          textSize={2}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            setParticipantId(item?.participant?._id)
                          }
                          style={{
                            borderWidth: 2,
                            borderColor: AppColors.BTNCOLOURS,
                            // padding: responsiveHeight(0.3),
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: responsiveHeight(3.5),
                            width: responsiveWidth(7),
                            borderRadius: responsiveHeight(3),
                          }}>
                          {participantId === item?.participant?._id ? (
                            <Ionicons
                              name="checkmark-sharp"
                              size={18}
                              color={AppColors.BTNCOLOURS}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setImgUrl(
                            `${ImageBaseUrl}${item?.participant?.images[0]}`,
                          );
                          setVisible(true);
                        }}>
                        <Image
                          style={{
                            height: responsiveHeight(20),
                            width: '100%',
                            marginTop: responsiveHeight(2),
                            borderRadius: responsiveHeight(1),
                          }}
                          source={{
                            uri: `${ImageBaseUrl}${item?.participant.images[0]}`,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>

            {/* <LineBreak space={3} /> */}
          </ScrollView>
          <ImageViewing
            images={[{uri: imgUrl}]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          />
          <View
            style={{
              // flex: 1,
              alignSelf: 'center',
              // justifyContent: 'flex-end',
              // marginTop: responsiveHeight(2),
              position: 'absolute',
              bottom: 10,
            }}>
            <AppButton
              disabled={!participantId}
              width={89}
              bgColor={
                !participantId ? AppColors.disabled : AppColors.BTNCOLOURS
              }
              title={
                voteLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Submit'
                )
              }
              handlePress={() => addVoteHandler()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BattlePoll;
