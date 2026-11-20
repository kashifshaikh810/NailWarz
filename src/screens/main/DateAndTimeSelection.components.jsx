/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppTextComps/AppText';
import AppButton from '../../components/AppButton';
import LineBreak from '../../components/LineBreak';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';

export const DateOption = ({disabled = false, item, selected, onPress}) => (
  <TouchableOpacity
    activeOpacity={disabled ? 1 : 0.75}
    disabled={disabled}
    onPress={onPress}
    style={{
      width: responsiveWidth(19),
      height: responsiveHeight(8.5),
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: selected
        ? AppColors.BTNCOLOURS
        : disabled
        ? '#EEEEEE'
        : '#E5E5E5',
      backgroundColor: selected
        ? '#FFF4F4'
        : disabled
        ? '#F8F8F8'
        : AppColors.WHITE,
      opacity: disabled ? 0.45 : 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: responsiveWidth(3),
    }}>
    <AppText
      title={item?.label}
      textSize={1.4}
      textColor={
        selected
          ? AppColors.BTNCOLOURS
          : disabled
          ? '#B8B8B8'
          : AppColors.DARKGRAY
      }
      textFontWeight
    />
    <LineBreak space={0.25} />
    <AppText
      title={item?.date}
      textSize={1.55}
      textColor={
        selected ? AppColors.BTNCOLOURS : disabled ? '#B8B8B8' : AppColors.BLACK
      }
      textFontWeight
    />
  </TouchableOpacity>
);

export const MoreDatesOption = ({disabled = false, onPress}) => (
  <TouchableOpacity
    activeOpacity={disabled ? 1 : 0.75}
    disabled={disabled}
    onPress={onPress}
    style={{
      width: responsiveWidth(20),
      height: responsiveHeight(8.5),
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: disabled ? '#EEEEEE' : '#E5E5E5',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled ? '#F8F8F8' : AppColors.WHITE,
      opacity: disabled ? 0.45 : 1,
    }}>
    <EvilIcons
      name="calendar"
      size={responsiveFontSize(3)}
      color={disabled ? '#B8B8B8' : AppColors.BTNCOLOURS}
    />
    <AppText
      title="More dates"
      textSize={1.35}
      textColor={disabled ? '#B8B8B8' : AppColors.BLACK}
      textFontWeight
    />
  </TouchableOpacity>
);

export const MultiServiceSummary = ({
  appointmentServices,
  scheduleComplete,
  selectedSchedule,
  totalDuration,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: responsiveHeight(2),
    }}>
    <View style={{flex: 1, paddingRight: responsiveWidth(3)}}>
      <AppText
        title={`${appointmentServices.length} services to schedule`}
        textSize={1.9}
        textColor={AppColors.BLACK}
        textFontWeight
      />
      <AppText
        title={`${totalDuration} mins total. Choose a time for each service.`}
        textSize={1.45}
        textColor={AppColors.subTitle}
      />
    </View>
    <View
      style={{
        backgroundColor: scheduleComplete ? '#EAF8EF' : '#FFF4F4',
        borderRadius: 20,
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(0.75),
      }}>
      <AppText
        title={`${selectedSchedule.length}/${appointmentServices.length} scheduled`}
        textSize={1.35}
        textColor={scheduleComplete ? AppColors.GREEN : AppColors.BTNCOLOURS}
        textFontWeight
      />
    </View>
  </View>
);

const SlotLoadingState = () => (
  <View
    style={{
      minHeight: responsiveHeight(5.4),
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: responsiveHeight(0.8),
    }}>
    <ActivityIndicator size="small" color={AppColors.BTNCOLOURS} />
    <AppText
      title="Checking available times..."
      textSize={1.5}
      textColor={AppColors.subTitle}
      styles={{marginLeft: responsiveWidth(2)}}
    />
  </View>
);

const EmptySlotState = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: responsiveHeight(0.8),
    }}>
    <Feather
      name="calendar"
      size={responsiveFontSize(1.9)}
      color={AppColors.DARKGRAY}
    />
    <AppText
      title="No suitable times available on this date"
      textSize={1.45}
      textColor={AppColors.DARKGRAY}
      styles={{marginLeft: responsiveWidth(2)}}
    />
  </View>
);

export const ServiceScheduleCard = ({
  availableSlots,
  isLoading,
  onSelectTime,
  requiresSelection = false,
  selectedSlot,
  service,
  serviceIndex,
}) => (
  <View
    style={{
      borderRadius: 12,
      borderWidth: 1,
      borderColor: requiresSelection
        ? '#F0B8B8'
        : selectedSlot
        ? '#E6BDBD'
        : '#E8E8E8',
      backgroundColor: AppColors.WHITE,
      overflow: 'hidden',
    }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(3.5),
        paddingVertical: responsiveHeight(1.4),
        backgroundColor: requiresSelection || selectedSlot ? '#FFF8F8' : '#FAFAFA',
      }}>
      <View
        style={{
          width: responsiveHeight(3.5),
          height: responsiveHeight(3.5),
          borderRadius: responsiveHeight(1.75),
          backgroundColor: selectedSlot ? AppColors.BTNCOLOURS : '#EDEDED',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {selectedSlot ? (
          <Feather
            name="check"
            size={responsiveFontSize(1.7)}
            color={AppColors.WHITE}
          />
        ) : (
          <AppText
            title={`${serviceIndex + 1}`}
            textSize={1.45}
            textColor={AppColors.subTitle}
            textFontWeight
          />
        )}
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: responsiveWidth(3),
          paddingRight: responsiveWidth(2),
        }}>
        <AppText
          title={service.serviceName || 'Nail service'}
          textSize={1.75}
          textColor={AppColors.BLACK}
          textFontWeight
          numberOfLines={1}
        />
        <AppText
          title={`${service.selectedTechnicianName || 'Technician'} • ${service.durationMinutes} mins`}
          textSize={1.4}
          textColor={AppColors.subTitle}
          numberOfLines={1}
        />
      </View>
      {selectedSlot ? (
        <AppText
          title={selectedSlot.time}
          textSize={1.45}
          textColor={AppColors.BTNCOLOURS}
          textFontWeight
        />
      ) : requiresSelection ? (
        <View
          style={{
            backgroundColor: '#FFF1F1',
            borderRadius: 12,
            paddingHorizontal: responsiveWidth(2),
            paddingVertical: responsiveHeight(0.4),
          }}>
          <AppText
            title="Update required"
            textSize={1.15}
            textColor={AppColors.BTNCOLOURS}
            textFontWeight
          />
        </View>
      ) : null}
    </View>

    <View
      style={{
        paddingHorizontal: responsiveWidth(3.5),
        paddingVertical: responsiveHeight(1.4),
      }}>
      {requiresSelection ? (
        <>
          <AppText
            title="Please choose a new time."
            textSize={1.3}
            textColor={AppColors.BTNCOLOURS}
          />
          <LineBreak space={0.8} />
        </>
      ) : null}
      {isLoading ? (
        <SlotLoadingState />
      ) : !availableSlots.length ? (
        <EmptySlotState />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: responsiveWidth(2),
          }}>
          {availableSlots.map(slot => {
            const isSelected = selectedSlot?.raw === slot.raw;
            return (
              <TouchableOpacity
                key={`${service.scheduleKey}-${slot.raw}`}
                activeOpacity={0.75}
                onPress={() => onSelectTime(service, slot)}
                style={{
                  minWidth: responsiveWidth(26),
                  paddingHorizontal: responsiveWidth(2.5),
                  paddingVertical: responsiveHeight(1),
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? AppColors.BTNCOLOURS
                    : '#DDDDDD',
                  backgroundColor: isSelected
                    ? AppColors.BTNCOLOURS
                    : AppColors.WHITE,
                  alignItems: 'center',
                }}>
                <AppText
                  title={slot.time}
                  textSize={1.4}
                  textColor={isSelected ? AppColors.WHITE : AppColors.BLACK}
                  textFontWeight
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  </View>
);

export const AppointmentTimeline = ({selectedSchedule}) => (
  <View
    style={{
      marginTop: responsiveHeight(2),
      padding: responsiveWidth(4),
      borderRadius: 12,
      backgroundColor: '#F8F8F8',
    }}>
    <AppText
      title="Your appointment timeline"
      textSize={1.75}
      textColor={AppColors.BLACK}
      textFontWeight
    />
    <LineBreak space={1} />
    {selectedSchedule.map((schedule, index) => (
      <View
        key={`${schedule.serviceId}-${index}`}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom:
            index === selectedSchedule.length - 1 ? 0 : responsiveHeight(1),
        }}>
        <View style={{width: responsiveWidth(27)}}>
          <AppText
            title={`${schedule.time} - ${schedule.endTime}`}
            textSize={1.4}
            textColor={AppColors.BTNCOLOURS}
            textFontWeight
          />
        </View>
        <View style={{flex: 1}}>
          <AppText
            title={schedule.serviceName}
            textSize={1.45}
            textColor={AppColors.BLACK}
            textFontWeight
            numberOfLines={1}
          />
          <AppText
            title={schedule.technicianName}
            textSize={1.35}
            textColor={AppColors.subTitle}
            numberOfLines={1}
          />
        </View>
      </View>
    ))}
  </View>
);

export const BottomActionBar = ({
  buttonTitle,
  disabled,
  insets,
  onPress,
}) => (
  <View
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 60 + insets.bottom,
      paddingHorizontal: responsiveWidth(4),
      paddingTop: responsiveHeight(1),
      paddingBottom: responsiveHeight(1),
      backgroundColor: AppColors.WHITE,
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
    }}>
    <AppButton
      title={buttonTitle}
      disabled={disabled}
      bgColor={disabled ? '#CCCCCC' : AppColors.BTNCOLOURS}
      style={{
        width: '100%',
        minHeight: responsiveHeight(6.2),
        borderRadius: 12,
      }}
      handlePress={onPress}
    />
  </View>
);
