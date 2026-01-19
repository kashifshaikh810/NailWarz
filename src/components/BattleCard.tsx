/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AppColors from '../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/Responsive_Dimensions';
import LineBreak from './LineBreak';
import AppButton from './AppButton';
import { ImageBaseUrl } from '../BaseUrl';
import { ShowToast } from '../GlobalFunctions/auth';
import AppText from './AppTextComps/AppText';

/* =======================
   Types
======================= */

interface Participant {
  _id: string;
  participant: {
    images: string[];
  };
}

interface BattleItem {
  _id: string;
  name: string;
  description: string;
  status: 'Start' | 'End' | 'Completed';
  participants: Participant[];
}

type BattleCardProps = {
  item: BattleItem;
};

type RootStackParamList = {
  BattlePoll: { battleId: string };
  FinalScoreBoard: { battleId: string };
};

/* =======================
   Component
======================= */

const BattleCard: React.FC<BattleCardProps> = ({ item }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const capitalize = text =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigation = () => {
    if (item.status === 'active') {
      navigation.navigate('BattlePoll', { battleId: item });
    } else if (item.status === 'completed') {
      navigation.navigate('FinalScoreBoard', { battleId: item });
    } else {
      ShowToast('error', 'This Battle Is Not Started Yet');
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'upcoming':
        return '#F59E0B';
      case 'completed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
        return '#ECFDF5';
      case 'upcoming':
        return '#FFF7ED';
      case 'completed':
        return '#F3F4F6';
      default:
        return '#F3F4F6';
    }
  };
  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.card}>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <Swiper
            autoplay
            autoplayTimeout={3}
            loop
            scrollEnabled={false}
            showsPagination={false}
            onIndexChanged={index => setActiveIndex(index)} // ✅ IMPORTANT
          >
            {item.participants.map(p => (
              <Image
                key={p._id}
                source={{ uri: `${ImageBaseUrl}${p.participant.images[0]}` }} // replace with API image when ready
                style={styles.image}
              />
            ))}
          </Swiper>

          {/* Overlay */}
          <View style={styles.overlay} />
          <View
            style={{
              position: 'absolute',
              top: responsiveHeight(1),
              right: responsiveWidth(3),
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: responsiveHeight(0.6),
              paddingHorizontal: responsiveWidth(2.5),
              borderRadius: responsiveHeight(1.5),
              backgroundColor: getStatusBg(item.status),
            }}>

            <View
              style={{
                height: responsiveHeight(0.9),
                width: responsiveHeight(0.9),
                borderRadius: responsiveHeight(1),
                backgroundColor: getStatusColor(item.status),
                marginRight: responsiveWidth(1.5),
              }}
            />

            <AppText
              title={item.status === 'active' ? 'Battle Started' : item.status === 'completed' ? 'Battle Completed' : 'Battle In Progress'}
              textColor="#374151"
              textSize={1.3}
              textFontWeight
            />
          </View>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* ✅ Custom Dots */}
          <View style={styles.dotsContainer}>
            {item.participants.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <Text style={styles.description}>{item.description}</Text>

          <LineBreak space={2} />

          <AppButton
            title="OPEN BATTLE"
            handlePress={handleNavigation}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(BattleCard);

/* =======================
   Styles
======================= */

const styles = StyleSheet.create({
  shadowWrapper: {
    // margin: responsiveHeight(1.5),

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Android Shadow
    elevation: 5,
    margin:  Platform.OS === 'android' ? responsiveHeight(1.5) : null,

    borderRadius: 12,
    backgroundColor: Platform.OS === 'android' ? AppColors.WHITE : 'transparent',
  },
  card: {
    backgroundColor: AppColors.WHITE,
    // elevation: 5,
    overflow: 'hidden',
    borderRadius: 12,
    margin: responsiveHeight(1.5),
  },
  sliderContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: '800',
    color: AppColors.WHITE,
  },
  content: {
    backgroundColor: AppColors.WHITE,
    padding: responsiveHeight(1.5),
  },
  description: {
    fontSize: responsiveFontSize(2),
    color: '#0B0C16',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: responsiveHeight(1),
  },
  dot: {
    width: responsiveWidth(2.8),
    height: responsiveHeight(1.6),
    borderRadius: responsiveHeight(2),
    marginHorizontal: 3,
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    width: responsiveWidth(3.5),
    height: responsiveHeight(1.8),
    backgroundColor: AppColors.BTNCOLOURS,
  },
});
