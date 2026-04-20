/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import AppText from './AppTextComps/AppText';
import AppColors from '../utils/AppColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ImageBaseUrl } from '../BaseUrl';
import StarRating from 'react-native-star-rating-widget';
import moment from 'moment';

type props = {
  img?: any;
  title?: string;
  location?: string;
  KM?: string;
  Rating?: number;
  TotalNoOfRating?: number;
  component?: any;
  isShowDeleteIcon?: any;
  setIsShowDeleteIcon?: any;
  itemId?: any;
  onPress?: any;
  saloonId?: string;
  showDeleteCard?: boolean;
  textWidth?: number;
  workingDays?: any;
  setShowRemoveModal?: any;
  disabled?: boolean;
};

const SaloonsCard = ({
  KM,
  Rating,
  TotalNoOfRating,
  img,
  location,
  title,
  component,
  setIsShowDeleteIcon,
  itemId,
  saloonId,
  isShowDeleteIcon,
  textWidth,
  showDeleteCard = true,
  workingDays,
  setShowRemoveModal,
  disabled = false,
}: props) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = isShowDeleteIcon?.id === itemId;
  console.log('workingDays,,,,,,,,', workingDays);
  console.log('workingDays?.isActive,,,,,,,,', workingDays?.isActive);
  const roundedRating = Math.round(Rating * 2) / 2;

  const handlePress = () => {
    if (!isOpen) {
      setIsShowDeleteIcon({ id: itemId, shown: true });
    } else {
      setIsShowDeleteIcon({ id: 0, shown: false });
    }
  };

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? -80 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={component ? { transform: [{ translateX }] } : {}}>
      <TouchableOpacity
      disabled={disabled}
        activeOpacity={0.9}
        style={{ alignSelf: showDeleteCard ? null : 'center' }}
        onPress={() => {
          if (component) {
            handlePress();
          } else {
            navigation.navigate('HomeDetails', { saloonId });
          }
        }}>
        <View style={{ flexDirection: 'row', }}>
          <View
            style={{
              padding: 20,
              borderRadius: 10,
              width: responsiveWidth(90),
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: AppColors.WHITE,
              marginHorizontal: responsiveWidth(-0.2),
              marginVertical: responsiveHeight(1.5),

              // Shadow
              elevation: 7,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 5,
            }}>
            <Image
              source={{ uri: `${ImageBaseUrl}${img}` }}
              style={{
                height: responsiveHeight(12),
                width: responsiveHeight(12),
                // resizeMode: 'contain',
                borderRadius: 10,
                marginRight: responsiveHeight(2),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: responsiveWidth(60),
              }}>
              <View style={{ gap: 5 }}>
                <AppText
                  title={title}
                  textColor={AppColors.BLACK}
                  textSize={2.1}
                  textFontWeight
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Ionicons
                    name={'location-outline'}
                    size={responsiveFontSize(2)}
                    color={AppColors.DARKGRAY}
                  />
                  <AppText
                    title={location}
                    textwidth={textWidth}
                    numberOfLines={1}
                    textSize={1.7}
                    textColor={AppColors.DARKGRAY}
                  />
                </View>
                {roundedRating ? (
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
                    <StarRating
                      starSize={responsiveHeight(2.2)}
                      color={AppColors.RED}
                      rating={roundedRating}
                      maxStars={5}
                      starStyle={{ marginHorizontal: 1.5 }}
                      onChange={() => console.log('first')}
                    />
                    <AppText
                      title={`${TotalNoOfRating}`}
                      textSize={2}
                      textColor="#989898"
                    />
                  </View>
                ) : null}

                <AppText
                  title={workingDays?.isActive ? `Open Until ${moment(workingDays?.endTime, "HH:mm").format("hh:mm A")}` : 'Closed'}
                  textSize={1.7}
                  textColor={AppColors.RED}
                />

              </View>
            </View>
          </View>
          {/* {showDeleteCard ? (
            <TouchableOpacity
              onPress={() => setShowRemoveModal(true)}
              style={{
                backgroundColor: '#FA52521A',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(2.7),
                borderRadius: 10,
                gap: 5,
              }}>
              <AntDesign
                name={'delete'}
                size={responsiveFontSize(2.5)}
                color={AppColors.BTNCOLOURS}
              />
              <AppText
                title="Remove"
                textColor={AppColors.BTNCOLOURS}
                textSize={1.7}
              />
            </TouchableOpacity>
          ) : null} */}

        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SaloonsCard;
