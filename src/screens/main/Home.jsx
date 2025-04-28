/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import AppText from '../../components/AppTextComps/AppText';
import AppColors from '../../utils/AppColors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import BackgroundScreen from '../../components/AppTextComps/BackgroundScreen';
import AppTextInput from '../../components/AppTextInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APPImages from '../../assets/APPImages';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../components/AppButton';
import Entypo from 'react-native-vector-icons/Entypo';
import SaloonsCard from '../../components/SaloonsCard';
import SaloonsArray from '../../utils/SaloonsArray';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [serviceSelected, setServiceSelect] = useState(0);
  const Servies = [
    {id: 1, name: 'Dip Powder Nails', icon: APPImages.COMB},
    {id: 2, name: 'Gel Manicure/Pedicure', icon: APPImages.FACIAL},
  ];
  const navigation = useNavigation();

  return (
    <BackgroundScreen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigation.navigate('SearchLocation')}>
          <EvilIcons
            name={'location'}
            color={AppColors.BLUE}
            size={responsiveFontSize(5)}
          />
          <View>
            <AppText title="Location" textSize={2} />
            <AppText title="Lakewood, California" textSize={2} textFontWeight />
          </View>
        </TouchableOpacity>

        <Ionicons
          name={'notifications-outline'}
          size={responsiveFontSize(3)}
          color={AppColors.BLACK}
        />
      </View>

      <View style={{marginTop: 20}}>
        <AppTextInput
          containerBg={AppColors.INPUTBG}
          inputPlaceHolder={'Enter address or city name'}
          logo={
            <AntDesign
              name={'search1'}
              size={responsiveFontSize(2)}
              color={AppColors.BLACK}
            />
          }
        />
      </View>

      <ImageBackground
        source={APPImages.DISCOUNT}
        style={{
          width: responsiveWidth(90),
          height: responsiveHeight(20),
          borderRadius: 15,
          overflow: 'hidden',
          padding: 20,
          marginTop: 20,
        }}>
        <LinearGradient
          colors={[
            AppColors.WHITE,
            AppColors.BLUE,
            AppColors.BLUE,
            AppColors.BLUE,
          ]}
          end={{x: 0, y: 1}}
          style={{
            position: 'absolute',
            zIndex: 1,
            width: responsiveWidth(90),
            height: responsiveHeight(20),
            opacity: 0.5,
          }}
        />
        <View style={{position: 'absolute', zIndex: 2, padding: 20}}>
          <AppText
            title="Morning Special!"
            textSize={2}
            textFontWeight
            textColor={AppColors.WHITE}
          />
          <AppText
            title="Get 20% Off"
            textSize={3}
            textFontWeight
            textColor={AppColors.WHITE}
          />
          <AppText
            title="on All Nail Service Between 9-10 AM."
            textSize={1.5}
            textColor={AppColors.WHITE}
          />
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.WHITE,
              alignSelf: 'flex-start',
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <AppText
              title="Book Now"
              textColor={AppColors.BLACK}
              textSize={2}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={{marginTop: 10, gap: 10}}>
        <AppText
          title="Services"
          textColor={AppColors.BLACK}
          textSize={3}
          textFontWeight
        />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FlatList
            data={Servies}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 10}}
            renderItem={({item, index}) => {
              const logic = serviceSelected == index;
              return (
                <TouchableOpacity
                  onPress={() => setServiceSelect(index)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: logic
                      ? AppColors.BTNCOLOURS
                      : AppColors.WHITE,
                    borderRadius: 10,
                    gap: 5,
                  }}>
                  <Image
                    source={item.icon}
                    style={{height: 20, width: 20, resizeMode: 'contain'}}
                  />
                  <AppText
                    title={item.name}
                    textSize={2}
                    textColor={logic ? AppColors.WHITE : AppColors.BLACK}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <AppText
          title="Nearby Salons"
          textColor={AppColors.BLACK}
          textSize={3}
          textFontWeight
        />

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
          <Entypo
            name={'location'}
            color={AppColors.BLUE}
            size={responsiveFontSize(2)}
          />
          <TouchableOpacity
            onPress={() =>  navigation.navigate('MapView')}
          >
          <AppText
            title="View on Map"
            textColor={AppColors.BLUE}
            textSize={2}
            />
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={SaloonsArray}
        contentContainerStyle={{gap: 10}}
        renderItem={({item}) => {
          return (
            <SaloonsCard
              title={item.title}
              KM={item.KM}
              Rating={item.Rating}
              TotalNoOfRating={item.TotalNoOfRating}
              img={item.img}
              location={item.location}
            />
          );
        }}
      />
    </BackgroundScreen>
  );
};

export default Home;
