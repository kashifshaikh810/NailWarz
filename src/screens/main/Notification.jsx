/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {getAllNotifications} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';
import AppHeader from '../../components/AppHeader';
import AppColors from '../../utils/AppColors';
import {ShowToast} from '../../GlobalFunctions/auth';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
const Notification = ({navigation}) => {
  const {_id} = useSelector(state => state?.user?.userData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllNotificationHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getAllNotifications(_id);
      setIsLoading(false);

      setData(response.data);
    } catch (error) {
      setIsLoading(false);

      return ShowToast('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getAllNotificationHandler();
  }, []);

  const memoizedNotifications = useMemo(() => data, [data]);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
        <AppHeader onPress={() => navigation.goBack()} title="Notification" />
        {isLoading ? (
          <View
            style={{flex: 0.9, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={45} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View style={{padding: responsiveHeight(2)}}>
            <FlatList
              data={memoizedNotifications}
              contentContainerStyle={{gap: responsiveHeight(2)}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('StylistSelect', {
                        data: {
                          saloonId: item?.salonId?._id,
                          serviceId: item?.bookingId?.serviceId?._id,
                          serviceName: item?.bookingId?.serviceId?.serviceName,
                          price: item?.bookingId?.serviceId?.price,
                          technicians: item?.bookingId?.serviceId?.technicianId,
                          reschedule: true,
                          myBookingId: item?.bookingId?._id,
                        },
                      });
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: '#DBDBDB',
                      borderRadius: responsiveHeight(2),
                      padding: responsiveHeight(2),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: responsiveHeight(2),
                      }}>
                      <View
                        style={{
                          backgroundColor: AppColors.iconColor,
                          padding: responsiveHeight(2),
                          borderRadius: responsiveHeight(2),
                        }}>
                        <Ionicons
                          name="calendar"
                          size={25}
                          color={AppColors.WHITE}
                        />
                      </View>
                      <View>
                        <AppText
                          textFontWeight
                          textSize={2}
                          title={item?.salonId?.salonName}
                        />
                        <AppText
                          textwidth={60}
                          textSize={1.8}
                          textColor={AppColors.DARKGRAY}
                          title={item?.message}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
