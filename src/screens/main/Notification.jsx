/* eslint-disable react-native/no-inline-styles */
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {getAllNotifications, getBookingById} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';
import AppHeader from '../../components/AppHeader';
import AppColors from '../../utils/AppColors';
import {ShowToast} from '../../GlobalFunctions/auth';
import {responsiveHeight} from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import {buildBookingServiceSelectionPayload} from '../../utils/bookingSelectionPayload';

const getServicesFromNotificationBooking = booking => {
  if (!booking) {
    return [];
  }

  const rawServicesDetail = booking?.servicesDetail || booking?.serviceDetail;
  const servicesDetail = Array.isArray(rawServicesDetail)
    ? rawServicesDetail
    : rawServicesDetail && typeof rawServicesDetail === 'object'
    ? [rawServicesDetail]
    : [];

  if (servicesDetail.length) {
    return servicesDetail
      .map(detail => {
        if (!detail || typeof detail !== 'object') {
          return null;
        }

        return {
          ...detail,
          slotId: detail?.slotId || detail?._id,
          serviceDetailId: detail?.slotId || detail?._id,
          appointmentServiceId: detail?.slotId || detail?._id,
          _id: detail?.service?._id || detail?.service || detail?._id,
          serviceName: detail?.serviceName || detail?.service?.serviceName,
          price: detail?.price ?? detail?.service?.price,
          technicianId: detail?.service?.technicianId || [],
          bookedTechnician: detail?.technician || null,
        };
      })
      .filter(Boolean);
  }

  if (booking?.serviceId) {
    const singleService =
      typeof booking.serviceId === 'object' ? booking.serviceId : null;
    if (singleService) {
      return [
        {
          _id: singleService?._id,
          serviceName: singleService?.serviceName,
          price: singleService?.price,
          technicianId: singleService?.technicianId || [],
          bookedTechnician: booking?.technicianId || null,
        },
      ];
    }
  }

  return [];
};

const isNotificationTappable = item => {
  if (item?.type === 'Reschedule') {
    return true;
  }

  const title = (item?.title || '').toLowerCase();
  if (title.includes('canceled') || title.includes('cancelled')) {
    return true;
  }

  return false;
};

const Notification = ({navigation}) => {
  const {_id} = useSelector(state => state?.user?.userData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log('data.message', data);
  const getAllNotificationHandler = async () => {
    setIsLoading(true);
    try {
      const response = await getAllNotifications(_id);
      console.log('response.data', response);
      setIsLoading(false);
      if (response.success) {
        setData(response.data);
      } else {
        ShowToast('error', response.message);
      }
    } catch (error) {
      setIsLoading(false);

      return ShowToast('error', error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getAllNotificationHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNotificationPress = async item => {
    console.log('Notification card pressed:', item);
    // Legacy single-service reschedule flow
    if (item?.type === 'Reschedule') {
      navigation.navigate('StylistSelect', {
        data: {
          saloonId: item?.salonId?._id || item?.salonId,
          serviceId: item?.bookingId?.serviceId?._id || item?.bookingId?.serviceId,
          serviceName: item?.bookingId?.serviceId?.serviceName,
          price: item?.bookingId?.serviceId?.price,
          technicians: item?.bookingId?.serviceId?.technicianId,
          reschedule: true,
          myBookingId: item?.bookingId?._id || item?.bookingId,
        },
      });
      return;
    }

    // Canceled appointment — navigate to rebook with all services
    let booking = item?.bookingId;
    let resolvedSalonId =
      item?.salonId?._id ||
      item?.salonId ||
      booking?.salonId?._id ||
      booking?.salonId ||
      booking?.saloonId?._id ||
      booking?.saloonId;
    let services = getServicesFromNotificationBooking(booking);

    // Fallback: If services or salonId are missing, try to fetch full booking from API
    const rawBookingId =
      typeof booking === 'string'
        ? booking
        : booking?._id || item?.bookingId?._id || item?.bookingId;

    if ((!resolvedSalonId || !services.length) && rawBookingId && typeof rawBookingId === 'string') {
      try {
        setIsLoading(true);
        const bookingRes = await getBookingById(rawBookingId);
        setIsLoading(false);
        const fetchedBooking = bookingRes?.data || bookingRes?.booking || bookingRes;
        if (fetchedBooking) {
          booking = fetchedBooking;
          resolvedSalonId =
            resolvedSalonId ||
            fetchedBooking?.salonId?._id ||
            fetchedBooking?.salonId ||
            fetchedBooking?.saloonId?._id ||
            fetchedBooking?.saloonId;
          services = getServicesFromNotificationBooking(fetchedBooking);
        }
      } catch (err) {
        setIsLoading(false);
        console.warn('Failed to fetch full booking details for notification item:', err);
      }
    }

    console.log('Notification tap resolved:', {
      resolvedSalonId,
      servicesCount: services.length,
      bookingId: booking?._id || booking,
    });

    if (!resolvedSalonId || !services.length) {
      return ShowToast(
        'error',
        'Unable to prepare this booking for rescheduling.',
      );
    }

    const payload = buildBookingServiceSelectionPayload({
      salonId: resolvedSalonId,
      saloonId: resolvedSalonId,
      services,
      reschedule: false,
      myBookingId: null,
      extra: {
        source: 'bookAgain',
      },
    });

    console.log('Notification tap navigation payload:', payload);

    navigation.navigate('StylistSelect', {
      data: payload,
    });
  };

  const memoizedNotifications = useMemo(() => data, [data]);
  return (
    <SafeAreaView style={[globalStyles.container, {backgroundColor: AppColors.WHITE}]}>
      <AppHeader onPress={() => navigation.goBack()} title="Notification" />
      {isLoading ? (
        <View
          style={{flex: 0.9, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={45} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <View style={{paddingHorizontal: responsiveHeight(2), flex: 1}}>
          {memoizedNotifications.length ? (
            <FlatList
              data={memoizedNotifications}
              contentContainerStyle={{
                gap: responsiveHeight(2),
                paddingTop: responsiveHeight(1),
                paddingBottom: responsiveHeight(12),
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item?._id || String(index)}
              renderItem={({item}) => {
                const isAdminBroadcast =
                  item?.type === 'AdminBroadcast' ||
                  item?.data?.type === 'admin broadcast' ||
                  (item?.type || '').toLowerCase().includes('admin') ||
                  (item?.type || '').toLowerCase().includes('broadcast');

                const displayTitle = isAdminBroadcast
                  ? (item?.title || 'Admin Announcement')
                  : (item?.salonId?.salonName || item?.title || 'Notification');

                const tappable = isNotificationTappable(item);

                return (
                  <TouchableOpacity
                    disabled={!tappable}
                    onPress={() => handleNotificationPress(item)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#DBDBDB',
                      borderRadius: responsiveHeight(2),
                      padding: responsiveHeight(2),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: responsiveHeight(2),
                      }}>
                      <View
                        style={{
                          backgroundColor: AppColors.iconColor,
                          padding: responsiveHeight(2),
                          borderRadius: responsiveHeight(2),
                        }}>
                        <Ionicons
                          name={isAdminBroadcast ? 'megaphone' : 'calendar'}
                          size={25}
                          color={AppColors.WHITE}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <AppText
                          textFontWeight
                          textSize={2}
                          title={displayTitle}
                        />
                        <AppText
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
          ) : (
            <View
              style={{
                flex: 0.8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AppText title="No Notifications Found..." textFontWeight textSize={2.5} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notification;
