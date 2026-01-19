/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AppText from '../../components/AppTextComps/AppText';
import APPImages from '../../assets/APPImages';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';
import {ImageBaseUrl} from '../../BaseUrl';
import {ShowToast} from '../../GlobalFunctions/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const StylistSelect = ({route}) => {
  const navigation = useNavigation();
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectRandomTech, setSelectRandomTech] = useState(null);
  const [technicianName, setTechnicianName] = useState();
  const {data} = route?.params;
  // technicians, saloonId, serviceName, price, serviceId
  console.log('selectedTechnician', selectedTechnician);
  console.log('data======<><><><><><><><><><>', data);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={{flex: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title="Choose Your Nail Technician"
        />
        <View
          style={{
            backgroundColor: '#B4B4B4',
            height: 0.5,
            elevation: 5,
            width: '100%',
          }}
        />

        <View
          style={{
            paddingHorizontal: responsiveWidth(3),
            marginVertical: responsiveHeight(2),
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectAnyTech', {data})}
            // onPress={() => {
            //   if (data?.technicians?.length > 0) {
            //     const randomIndex = Math.floor(
            //       Math.random() * data.technicians.length,
            //     );
            //     const randomTechnician = data.technicians[randomIndex];
            //     setSelectedTechnician(randomTechnician._id);
            //     setTechnicianName(randomTechnician.fullName);
            //     setSelectRandomTech(true);
            //   }
            // }}
            style={{
              flexDirection: 'row',
              paddingLeft: responsiveWidth(10),
              borderRadius: 10,
              borderWidth: selectRandomTech ? 2 : null,
              borderColor: selectRandomTech ? AppColors.BLUE : null,
              gap: responsiveWidth(8),
              paddingHorizontal: responsiveWidth(5),
              paddingVertical: responsiveHeight(3),
              alignItems: 'center',
              backgroundColor: AppColors.WHITE,
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.15,
            }}>
            <Feather
              name={'users'}
              size={responsiveFontSize(3)}
              color={AppColors.BLUE}
            />
            <View>
              <AppText
                title="Select Any Nail Technician"
                textSize={2}
                textColor={AppColors.BLACK}
              />

              <AppText
                title="Next available nail technician"
                textSize={1.8}
                textColor={AppColors.DARKGRAY}
              />
            </View>
          </TouchableOpacity>

          <LineBreak space={2} />

          <FlatList
            data={data?.technicians}
            contentContainerStyle={{margin: 10}}
            ItemSeparatorComponent={() => <LineBreak space={2} />}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTechnician(item._id);
                    setTechnicianName(item.fullName);
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingLeft: responsiveWidth(5),
                    borderRadius: 10,
                    gap: responsiveWidth(5),
                    paddingVertical: responsiveHeight(3),
                    alignItems: 'center',
                    backgroundColor:
                      selectedTechnician === item._id
                        ? AppColors.BTNCOLOURS
                        : AppColors.WHITE,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.15,
                  }}>
                  <Image
                    source={{uri: `${ImageBaseUrl}${item?.image}`}}
                    style={{
                      width: responsiveWidth(15),
                      height: responsiveHeight(8),
                      borderRadius: responsiveHeight(1),
                    }}
                  />
                  <View>
                    <AppText
                      title={item?.fullName}
                      textSize={2}
                      textColor={
                        selectedTechnician === item._id
                          ? AppColors.WHITE
                          : AppColors.BLACK
                      }
                    />

                    <AppText
                      textwidth={65}
                      title={item.designation}
                      textSize={1.8}
                      textColor={
                        selectedTechnician === item._id
                          ? AppColors.WHITE
                          : AppColors.DARKGRAY
                      }
                    />
                  </View>
                  {/* <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'flex-end',
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: item.ratingStatus
                        ? AppColors.PEACHCOLOUR
                        : isSelectedProfile.id === item.id
                        ? AppColors.BTNCOLOURS
                        : AppColors.WHITE,
                      gap: 10,
                    }}>
                    {item.ratingStatus && (
                      <SimpleLineIcons
                        name={'badge'}
                        size={responsiveFontSize(1.8)}
                        color={AppColors.BLACK}
                      />
                    )}
                    <AppText
                      title={item.ratingStatus}
                      textSize={1.8}
                      textColor={AppColors.BLACK}
                    />
                  </View>
                </View> */}
                </TouchableOpacity>
              );
            }}
          />

          <LineBreak space={4} />

          <AppButton
            disabled={selectedTechnician ? false : true}
            title="Select & Continue"
            bgColor={selectedTechnician ? AppColors.BTNCOLOURS : '#CCCCCC'}
            handlePress={() => {
              if (selectedTechnician) {
                navigation.navigate('DateAndTimeSelection', {
                  data: {
                    ...data,
                    selectedTechnician,
                    technicianName,
                  },
                });
              } else {
                return ShowToast('error', 'Plz Select A Stylist To Proceed');
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StylistSelect;
