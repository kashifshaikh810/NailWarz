/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import APPImages from '../../../assets/APPImages';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getAllBattles} from '../../../GlobalFunctions';
import AppIntroSlider from 'react-native-app-intro-slider';
import {ImageBaseUrl} from '../../../BaseUrl';
import Swiper from 'react-native-swiper';
import AppButton from '../../../components/AppButton';
import LineBreak from '../../../components/LineBreak';
import {ShowToast} from '../../../GlobalFunctions/auth';

const Warz = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allBattles, setAllBattles] = useState([]);
  console.log('allbattles', allBattles);
  console.log('posts', posts);

  const BattleCard = ({item}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <View
        style={{
          backgroundColor: AppColors.WHITE,
          elevation: 5,
          borderRadius: 12,
          margin: responsiveHeight(1.5),
          overflow: 'hidden',
        }}>
        {/* Image Slider */}
        <View style={{position: 'relative', height: 200}}>
          <Swiper
            autoplay
            scrollEnabled={false}
            autoplayTimeout={3}
            loop
            showsPagination={false}
            onIndexChanged={index => setActiveIndex(index)}>
            {item.salons.map(salon => (
              <Image
                key={salon._id}
                source={{uri: `${ImageBaseUrl}${salon.salonImage}`}}
                style={{width: '100%', height: 200}}
              />
            ))}
          </Swiper>

          {/* Overlay */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />

          {/* Title */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: responsiveFontSize(3.5),
                fontWeight: '800',
                color: 'white',
              }}>
              {item.battleName}
            </Text>
          </View>
        </View>

        {/* Custom Dots + Description */}
        <View
          style={{
            backgroundColor: AppColors.WHITE,
            padding: responsiveHeight(1.5),
          }}>
          {/* Custom Dots */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: responsiveHeight(1),
            }}>
            {item.salons.map((_, i) => (
              <View
                key={i}
                style={{
                  width:
                    activeIndex === i
                      ? responsiveWidth(3.5)
                      : responsiveWidth(2.8),
                  height:
                    activeIndex === i
                      ? responsiveHeight(1.8)
                      : responsiveHeight(1.6),
                  borderRadius: responsiveHeight(2),
                  marginHorizontal: 3,
                  backgroundColor:
                    activeIndex === i ? AppColors.BTNCOLOURS : '#D9D9D9',
                }}
              />
            ))}
          </View>

          {/* Description */}
          <Text
            style={{
              fontSize: responsiveFontSize(2),
              color: '#0B0C16',
              textAlign: 'center',
            }}>
            {item.description}
          </Text>

          <LineBreak space={2} />
          <AppButton
            handlePress={() =>
              navigation.navigate(
                item?.status === 'Start' ? 'BattlePoll' : 'FinalScoreBoard',
                {battleId: item?.status === 'Start' ? item?._id : item},
              )
            }
            title="OPEN BATTLE"
          />
        </View>
      </View>
    );
  };

  const getAllBattlesHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getAllBattles();
      setIsLoading(false);
      setAllBattles(response?.data);
    } catch (error) {
      setIsLoading(false);
      return ShowToast('error', error?.response?.data?.message);
      console.log('error', error);
    }
  };
  useEffect(() => {
    getAllBattlesHandler();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: AppColors.WHITE,
        padding: responsiveHeight(1),
      }}>
      <View style={{flex: 1}}>
        <View
          style={{
            // flexDirection: 'row',
            gap: responsiveHeight(1.5),
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: responsiveHeight(2),
          }}>
          {/* <Image
            source={APPImages.logoSmall}
            style={{
              alignSelf: 'flex-end',
              height: responsiveHeight(10),
              width: responsiveWidth(15),
            }}
            resizeMode="contain"
          /> */}
          <AppText
            // onPress={() => navigation.navigate('LiveVotingScores')}
            textSize={2.5}
            textColor={'red'}
            textFontWeight={'bold'}
            title="Welcome to the War Zone"
          />
          <AppText
            textSize={2.5}
            textColor={AppColors.BLACK}
            // textFontWeight={'bold'}
            title="Check out the online battles!"
          />
        </View>
        {isLoading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View>
            <FlatList
              data={allBattles}
              keyExtractor={item => item._id.toString()}
              contentContainerStyle={{marginTop: responsiveHeight(2)}}
              renderItem={({item}) => <BattleCard item={item} />}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Warz;
