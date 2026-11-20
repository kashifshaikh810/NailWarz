/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import AppText from '../../components/AppTextComps/AppText';
import CalendarModal from '../../components/CalendarModal';
import LineBreak from '../../components/LineBreak';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import {getTechnicianById} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';
import {globalStyles} from '../../GlobalFunctions/styles';
import {
  AppointmentTimeline,
  BottomActionBar,
  DateOption,
  MoreDatesOption,
  MultiServiceSummary,
  ServiceScheduleCard,
} from './DateAndTimeSelection.components';
import {
  convertSelectedDate,
  generateAvailableSlots,
  getNextDates,
  getServiceDuration,
  getTechnicianId,
  getTechnicianName,
  isPastLocalSlot,
} from './DateAndTimeSelection.utils';
import moment from 'moment';

const createDateOptionFromMoment = dateMoment => ({
  id: `reschedule-${dateMoment.format('YYYY-MM-DD')}`,
  day: dateMoment.format('dddd'),
  label: dateMoment.format('ddd').toUpperCase(),
  date: dateMoment.format('MMM D'),
  formattedDate: dateMoment.format('DD-MM-YYYY'),
});

const getScheduledAtIso = ({selectedDateFormatted, time}) => {
  const parsedDateTime = moment(
    `${selectedDateFormatted} ${time}`,
    ['DD-MM-YYYY hh:mm A', 'DD-MM-YYYY h:mm A'],
    true,
  );

  return parsedDateTime.isValid() ? parsedDateTime.toISOString() : null;
};

const createSlotFromScheduledAt = (service, scheduledAt) => {
  const scheduledMoment = scheduledAt ? moment(scheduledAt) : null;

  if (!scheduledMoment?.isValid()) {
    return null;
  }

  const startMinutes = scheduledMoment.hours() * 60 + scheduledMoment.minutes();
  const endMinutes = startMinutes + service.durationMinutes;

  return {
    id: scheduledMoment.format('HH:mm'),
    raw: scheduledMoment.format('HH:mm'),
    time: scheduledMoment.format('hh:mm A'),
    endTime: scheduledMoment
      .clone()
      .add(service.durationMinutes, 'minutes')
      .format('hh:mm A'),
    startMinutes,
    endMinutes,
    serviceId: service.serviceId,
    slotId: service.slotId,
    serviceName: service.serviceName,
    technicianId: service.selectedTechnicianId,
    technicianName: service.selectedTechnicianName,
    selectedTechnician: service.selectedTechnician,
    durationMinutes: service.durationMinutes,
    scheduledAt,
    isPreservedSlot: true,
  };
};

const DateAndTimeSelection = ({route}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const routeData = route?.params?.data;
  const data = useMemo(() => routeData || {}, [routeData]);
  const baseDates = useMemo(() => getNextDates(), []);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (data?.reschedule && data?.rescheduleBookingDate) {
      const parsedDate = moment(data.rescheduleBookingDate, 'DD-MM-YYYY', true);
      if (parsedDate.isValid()) {
        return createDateOptionFromMoment(parsedDate);
      }
    }
    if (data?.rescheduleDefaultDate) {
      const parsedDate = moment(data.rescheduleDefaultDate, 'DD-MM-YYYY', true);
      if (parsedDate.isValid()) {
        return createDateOptionFromMoment(parsedDate);
      }
    }
    return baseDates[0];
  });
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [technicianAvailability, setTechnicianAvailability] = useState({});
  const [selectedTimesByService, setSelectedTimesByService] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isMultiService =
    data?.isMultiService && Array.isArray(data?.serviceTechnicianSelections);
  const getConflictServiceName = detail =>
    `${detail?.serviceName || detail?.service?.serviceName || ''}`
      .trim()
      .toLowerCase();
  const getConflictScheduledAt = detail =>
    detail?.scheduledAt || detail?.formattedTime;
  const conflictedSlotIds = useMemo(() => {
    const conflictDetails = Array.isArray(data?.conflictedServiceDetail)
      ? data.conflictedServiceDetail
      : [];

    return new Set(
      conflictDetails
        .map(detail => detail?._id || detail?.slotId || detail?.serviceDetailId)
        .filter(Boolean),
    );
  }, [data?.conflictedServiceDetail]);
  const conflictedServiceKeys = useMemo(() => {
    const conflictDetails = Array.isArray(data?.conflictedServiceDetail)
      ? data.conflictedServiceDetail
      : [];

    return new Set(
      conflictDetails
        .map(detail => {
          const serviceName = getConflictServiceName(detail);
          const scheduledAt = getConflictScheduledAt(detail);
          return serviceName && scheduledAt ? `${serviceName}|${scheduledAt}` : null;
        })
        .filter(Boolean),
    );
  }, [data?.conflictedServiceDetail]);
  const appointmentServices = useMemo(() => {
    if (isMultiService) {
      return data.serviceTechnicianSelections
        .filter(
          selection =>
            selection?.serviceId &&
            getTechnicianId(selection?.selectedTechnicianId),
        )
        .map((selection, index) => ({
          ...selection,
          scheduleKey: `${selection.serviceId}-${
            selection.slotId || index
          }`,
          selectedTechnicianId: getTechnicianId(
            selection?.selectedTechnicianId,
          ),
          selectedTechnicianName: getTechnicianName(
            selection?.selectedTechnician,
            selection?.selectedTechnicianName,
          ),
          durationMinutes: getServiceDuration(selection),
          scheduledAt: selection?.scheduledAt,
          isConflicted:
            selection?.isConflicted ||
            conflictedSlotIds.has(selection?.slotId) ||
            conflictedServiceKeys.has(
              `${getConflictServiceName(selection)}|${getConflictScheduledAt(
                selection,
              )}`,
            ),
        }));
    }

    return [
      {
        scheduleKey: data?.serviceId || 'single-service',
        serviceId: data?.serviceId,
        slotId:
          data?.slotId || data?.serviceDetailId || data?.appointmentServiceId,
        serviceName: data?.serviceName,
        price: data?.price,
        selectedTechnicianId: getTechnicianId(data?.selectedTechnician),
        selectedTechnicianName: getTechnicianName(
          data?.selectedTechnicianData || data?.selectedTechnician,
          data?.technicianName,
        ),
        durationMinutes: getServiceDuration(data),
        scheduledAt: data?.scheduledAt,
        isConflicted: conflictedSlotIds.has(
          data?.slotId || data?.serviceDetailId || data?.appointmentServiceId,
        ),
      },
    ];
  }, [conflictedServiceKeys, conflictedSlotIds, data, isMultiService]);
  const conflictRecoveryDate = useMemo(() => {
    if (!data?.updatePendingBooking) {
      return null;
    }

    const firstScheduledService = appointmentServices.find(service =>
      moment(service?.scheduledAt).isValid(),
    );
    const scheduledMoment = firstScheduledService?.scheduledAt
      ? moment(firstScheduledService.scheduledAt)
      : null;

    return scheduledMoment?.isValid()
      ? createDateOptionFromMoment(scheduledMoment)
      : null;
  }, [appointmentServices, data?.updatePendingBooking]);

  const customDate = useMemo(
    () => convertSelectedDate(selectedDateFromCalendar),
    [selectedDateFromCalendar],
  );
  const lockedRescheduleDate = useMemo(() => {
    if (!data?.reschedule || !data?.rescheduleBookingDate) {
      return null;
    }

    const parsedDate = moment(data.rescheduleBookingDate, 'DD-MM-YYYY', true);
    return parsedDate.isValid() ? createDateOptionFromMoment(parsedDate) : null;
  }, [data?.reschedule, data?.rescheduleBookingDate]);
  const initialRescheduleDate = useMemo(() => {
    if (data?.rescheduleDefaultDate) {
      const parsedDate = moment(data.rescheduleDefaultDate, 'DD-MM-YYYY', true);
      if (parsedDate.isValid()) {
        return createDateOptionFromMoment(parsedDate);
      }
    }

    if (data?.rescheduleEntireBooking) {
      const firstScheduledService = appointmentServices.find(service =>
        moment(service?.scheduledAt).isValid(),
      );
      if (firstScheduledService?.scheduledAt) {
        const scheduledMoment = moment(firstScheduledService.scheduledAt);
        if (scheduledMoment.isValid()) {
          return createDateOptionFromMoment(scheduledMoment);
        }
      }
    }

    return null;
  }, [
    data?.rescheduleDefaultDate,
    data?.rescheduleEntireBooking,
    appointmentServices,
  ]);
  const datesData = useMemo(() => {
    if (lockedRescheduleDate) {
      const dateOptions = baseDates.some(
        item => item.formattedDate === lockedRescheduleDate.formattedDate,
      )
        ? baseDates
        : [lockedRescheduleDate, ...baseDates];

      return dateOptions.map(item => ({
        ...item,
        disabled: item.formattedDate !== lockedRescheduleDate.formattedDate,
      }));
    }

    if (conflictRecoveryDate) {
      const hasConflictDate = baseDates.some(
        item => item.formattedDate === conflictRecoveryDate.formattedDate,
      );

      return hasConflictDate ? baseDates : [conflictRecoveryDate, ...baseDates];
    }

    if (initialRescheduleDate) {
      const hasInitialDate = baseDates.some(
        item => item.formattedDate === initialRescheduleDate.formattedDate,
      );

      const combinedDates = hasInitialDate
        ? baseDates
        : [initialRescheduleDate, ...baseDates];

      if (
        customDate &&
        !combinedDates.some(
          item => item.formattedDate === customDate.formattedDate,
        )
      ) {
        return [...combinedDates, customDate];
      }

      return combinedDates;
    }

    if (
      !customDate ||
      baseDates.some(item => item.formattedDate === customDate.formattedDate)
    ) {
      return baseDates;
    }
    return [...baseDates, customDate];
  }, [
    baseDates,
    conflictRecoveryDate,
    customDate,
    initialRescheduleDate,
    lockedRescheduleDate,
  ]);
  const totalDuration = appointmentServices.reduce(
    (total, service) => total + service.durationMinutes,
    0,
  );
  const selectedSchedule = appointmentServices
    .map(service => selectedTimesByService[service.scheduleKey])
    .filter(Boolean);
  const requiredServices =
    data?.updatePendingBooking &&
    appointmentServices.some(service => service?.isConflicted)
      ? appointmentServices.filter(service => service?.isConflicted)
      : appointmentServices;
  const scheduleComplete =
    requiredServices.length > 0 &&
    requiredServices.every(service =>
      Boolean(selectedTimesByService[service.scheduleKey]),
    );
  const hasPastSelectedSlot = selectedSchedule.some(schedule =>
    isPastLocalSlot({
      selectedDateFormatted: selectedDate?.formattedDate,
      startMinutes: schedule?.startMinutes,
    }),
  );

  useEffect(() => {
    setSelectedTimesByService({});
  }, [
    data?.updatePendingBooking,
    data?.updateBookingId,
    data?.paymentConflictMessage,
  ]);

  useEffect(() => {
    if (!conflictRecoveryDate || lockedRescheduleDate) {
      return;
    }

    setSelectedDate(conflictRecoveryDate);
  }, [conflictRecoveryDate, lockedRescheduleDate]);

  useEffect(() => {
    if (!data?.updatePendingBooking || !conflictRecoveryDate) {
      return;
    }

    if (selectedDate?.formattedDate !== conflictRecoveryDate.formattedDate) {
      return;
    }

    const preservedSelections = appointmentServices.reduce((result, service) => {
      if (service?.isConflicted) {
        return result;
      }

      const scheduledMoment = service?.scheduledAt
        ? moment(service.scheduledAt)
        : null;

      if (
        scheduledMoment?.isValid() &&
        scheduledMoment.format('DD-MM-YYYY') === conflictRecoveryDate.formattedDate
      ) {
        const preservedSlot = createSlotFromScheduledAt(
          service,
          service.scheduledAt,
        );

        if (preservedSlot) {
          result[service.scheduleKey] = preservedSlot;
        }
      }

      return result;
    }, {});

    setSelectedTimesByService(previous => ({
      ...preservedSelections,
      ...Object.entries(previous).reduce((result, [key, schedule]) => {
        if (!schedule?.isPreservedSlot) {
          result[key] = schedule;
        }
        return result;
      }, {}),
    }));
  }, [
    appointmentServices,
    conflictRecoveryDate,
    data?.updatePendingBooking,
    selectedDate?.formattedDate,
  ]);

  useEffect(() => {
    if (lockedRescheduleDate) {
      setSelectedDate(lockedRescheduleDate);
      setSelectedTimesByService({});
    }
  }, [lockedRescheduleDate]);

  useEffect(() => {
    if (initialRescheduleDate && !lockedRescheduleDate && !customDate) {
      setSelectedDate(initialRescheduleDate);
    }
  }, [initialRescheduleDate, lockedRescheduleDate, customDate]);

  useEffect(() => {
    if (lockedRescheduleDate) {
      return;
    }

    if (!customDate) {
      return;
    }
    setSelectedDate(customDate);
    setSelectedTimesByService({});
  }, [customDate, lockedRescheduleDate]);

  useEffect(() => {
    let isActive = true;
    const technicianIds = [
      ...new Set(
        appointmentServices
          .map(service => service?.selectedTechnicianId)
          .filter(Boolean),
      ),
    ];

    if (!selectedDate?.formattedDate || !technicianIds.length) {
      setTechnicianAvailability({});
      return undefined;
    }

    const loadAvailability = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          technicianIds.map(async technicianId => {
            const response = await getTechnicianById(
              technicianId,
              selectedDate.formattedDate,
            );
            console.log('DateAndTime getTechnicianById response:', {
              technicianId,
              selectedDate: selectedDate.formattedDate,
              response,
            });
            return {technicianId, response};
          }),
        );

        if (!isActive) {
          return;
        }

        const nextAvailability = responses.reduce(
          (result, {technicianId, response}) => {
            const responseData = response?.data || response;
            result[technicianId] = {
              workingDays: responseData?.technician?.workingDays || [],
              appointments: responseData?.technicianAppointments || [],
            };
            return result;
          },
          {},
        );
        setTechnicianAvailability(nextAvailability);
      } catch (error) {
        if (isActive) {
          setTechnicianAvailability({});
          ShowToast(
            'error',
            error?.response?.data?.message ||
              'Unable to load technician availability',
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadAvailability();
    return () => {
      isActive = false;
    };
  }, [appointmentServices, selectedDate?.formattedDate]);

  const getSlotsForService = service => {
    const availability = technicianAvailability[service?.selectedTechnicianId];
    const workingDay = availability?.workingDays?.find(
      item => item?.day === selectedDate?.day && item?.isActive,
    );

    return generateAvailableSlots({
      workingDay,
      appointments: availability?.appointments,
      durationMinutes: service.durationMinutes,
      selectedDateFormatted: selectedDate?.formattedDate,
    });
  };

  const handleSelectDate = item => {
    if (item?.disabled) {
      return;
    }

    setSelectedDate(item);
    setSelectedTimesByService({});
  };

  const handleSelectTime = (service, slot) => {
    setSelectedTimesByService(previous => {
      const nextSelections = {...previous};
      nextSelections[service.scheduleKey] = {
        ...slot,
        serviceId: service.serviceId,
        slotId: service.slotId,
        serviceName: service.serviceName,
        technicianId: service.selectedTechnicianId,
        technicianName: service.selectedTechnicianName,
        selectedTechnician: service.selectedTechnician,
        durationMinutes: service.durationMinutes,
        scheduledAt: getScheduledAtIso({
          selectedDateFormatted: selectedDate?.formattedDate,
          time: slot?.time,
        }),
      };
      return nextSelections;
    });
  };

  const getBookingSummaryPayload = () => {
    const mappedServiceSchedules = appointmentServices.map((service, index) => {
      const selectedSlot = selectedTimesByService[service.scheduleKey];
      return {
        time: selectedSlot?.time,
        raw: selectedSlot?.raw,
        endTime: selectedSlot?.endTime,
        startMinutes: selectedSlot?.startMinutes,
        endMinutes: selectedSlot?.endMinutes,
        serviceId: service.serviceId,
        slotId: selectedSlot?.slotId || service.slotId,
        serviceName: service.serviceName,
        technicianId: service.selectedTechnicianId,
        technicianName: service.selectedTechnicianName,
        selectedTechnician: service.selectedTechnician,
        durationMinutes: service.durationMinutes,
        scheduledAt: selectedSlot?.scheduledAt,
        price: service.price,
        order: index + 1,
      };
    });
    const serviceSchedules = data?.updatePendingBooking
      ? mappedServiceSchedules.filter(schedule => Boolean(schedule?.time))
      : mappedServiceSchedules;
    const firstSchedule = serviceSchedules[0];
    const resolvedSalonId =
      data?.salonId ||
      data?.saloonId ||
      appointmentServices.find(service => service?.salonId)?.salonId ||
      appointmentServices.find(service => service?.saloonId)?.saloonId;

    const summaryPayload = {
      salonId: resolvedSalonId,
      price:
        data?.totalPrice ??
        serviceSchedules.reduce(
          (total, service) => total + (Number(service?.price) || 0),
          0,
        ),
      selectedTime: {
        id: firstSchedule?.raw,
        value: firstSchedule?.time,
        raw: firstSchedule?.raw,
      },
      selectedDate: selectedDate?.date,
      selectedDay: selectedDate?.day,
      selectedBookingDate: selectedDate?.formattedDate,
      serviceSchedules,
      reschedule: data?.reschedule,
      rescheduleEntireBooking: data?.rescheduleEntireBooking,
      myBookingId: data?.myBookingId,
      originalDate: data?.originalDate,
      updatePendingBooking: data?.updatePendingBooking,
      updateBookingId: data?.updateBookingId,
      existingServiceDetail: data?.existingServiceDetail,
      conflictedServiceDetail: data?.conflictedServiceDetail,
      paymentConflictMessage: data?.paymentConflictMessage,
    };

    if (!isMultiService) {
      return {
        ...summaryPayload,
        serviceId: firstSchedule?.serviceId,
        slotId: firstSchedule?.slotId,
        serviceDetailId: firstSchedule?.slotId,
        appointmentServiceId: firstSchedule?.slotId,
        selectedTechnician: firstSchedule?.technicianId,
        serviceName: firstSchedule?.serviceName,
        technicianName: firstSchedule?.technicianName,
      };
    }

    return summaryPayload;
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        style={{flex: 1, backgroundColor: AppColors.WHITE}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 60 + insets.bottom + responsiveHeight(12),
        }}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title={
            isMultiService ? 'Schedule Services' : 'Appointment Date & Time'
          }
        />
        <View style={{height: 0.5, backgroundColor: '#D8D8D8'}} />

        <View
          style={{
            paddingHorizontal: responsiveWidth(4),
            paddingTop: responsiveHeight(2),
          }}>
          {isMultiService ? (
            <MultiServiceSummary
              appointmentServices={appointmentServices}
              scheduleComplete={scheduleComplete}
              selectedSchedule={selectedSchedule}
              totalDuration={totalDuration}
            />
          ) : null}

          <AppText
            title="Choose a date"
            textSize={1.9}
            textColor={AppColors.BLACK}
            textFontWeight
          />
          <LineBreak space={1} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
            height: responsiveHeight(9),
          }}
          contentContainerStyle={{
            paddingLeft: responsiveWidth(4),
            paddingRight: responsiveWidth(4),
            alignItems: 'center',
          }}>
          {datesData.map(item => (
            <DateOption
              key={item.id}
              item={item}
              selected={
                selectedDate?.id === item.id ||
                selectedDate?.formattedDate === item?.formattedDate
              }
              disabled={item?.disabled}
              onPress={() => handleSelectDate(item)}
            />
          ))}
          <MoreDatesOption
            disabled={Boolean(lockedRescheduleDate)}
            onPress={() => setShowCalendarModal(true)}
          />
        </ScrollView>

        <View
          style={{
            paddingHorizontal: responsiveWidth(4),
            paddingTop: responsiveHeight(2.5),
          }}>
          <AppText
            title={isMultiService ? 'Schedule Each Service' : 'Choose a Time'}
            textSize={1.9}
            textColor={AppColors.BLACK}
            textFontWeight
          />
          <LineBreak space={1.2} />
          {isMultiService ? (
            <>
              <AppText
                title="Each service uses the availability of its selected technician. Choose any available time for each service."
                textSize={1.45}
                textColor={AppColors.subTitle}
              />
              <LineBreak space={1.2} />
            </>
          ) : null}

          <View style={{gap: responsiveHeight(1.5)}}>
            {appointmentServices.map((service, serviceIndex) => {
              const selectedSlot = selectedTimesByService[service.scheduleKey];
              const availableSlots = isLoading
                ? []
                : getSlotsForService(service);

              return (
                <ServiceScheduleCard
                  key={service.scheduleKey}
                  availableSlots={availableSlots}
                  isLoading={isLoading}
                  onSelectTime={handleSelectTime}
                  requiresSelection={
                    data?.updatePendingBooking && service?.isConflicted
                  }
                  selectedSlot={selectedSlot}
                  service={service}
                  serviceIndex={serviceIndex}
                />
              );
            })}
          </View>

          {scheduleComplete && isMultiService ? (
            <AppointmentTimeline selectedSchedule={selectedSchedule} />
          ) : null}
        </View>

        <CalendarModal
          visible={showCalendarModal}
          setVisible={() => setShowCalendarModal(false)}
          selected={selectedDateFromCalendar}
          setSelected={setSelectedDateFromCalendar}
        />
      </ScrollView>

      <BottomActionBar
        buttonTitle={
          data?.updatePendingBooking
            ? 'Review Updated Time'
            : isMultiService
            ? 'Review Booking'
            : 'Confirm Appointment'
        }
        disabled={!scheduleComplete || hasPastSelectedSlot}
        insets={insets}
        onPress={() => {
          if (!scheduleComplete) {
            return;
          }
          if (hasPastSelectedSlot) {
            ShowToast('error', 'Please choose a future appointment time.');
            setSelectedTimesByService(previous =>
              Object.entries(previous).reduce((result, [key, schedule]) => {
                if (
                  !isPastLocalSlot({
                    selectedDateFormatted: selectedDate?.formattedDate,
                    startMinutes: schedule?.startMinutes,
                  })
                ) {
                  result[key] = schedule;
                }
                return result;
              }, {}),
            );
            return;
          }
          const summaryPayload = getBookingSummaryPayload();
          console.log('DateAndTimeSelection booking summary payload:', {
            updatePendingBooking: summaryPayload?.updatePendingBooking,
            updateBookingId: summaryPayload?.updateBookingId,
            selectedBookingDate: summaryPayload?.selectedBookingDate,
            serviceSchedules: summaryPayload?.serviceSchedules?.map(
              schedule => ({
                slotId: schedule?.slotId,
                serviceName: schedule?.serviceName,
                time: schedule?.time,
                scheduledAt: schedule?.scheduledAt,
              }),
            ),
            existingServiceDetailCount:
              summaryPayload?.existingServiceDetail?.length || 0,
          });

          if (data?.updatePendingBooking && navigation.replace) {
            navigation.replace('BookingSummary', {
              data: summaryPayload,
            });
            return;
          }

          navigation.navigate('BookingSummary', {
            data: summaryPayload,
          });
        }}
      />
    </SafeAreaView>
  );
};

export default DateAndTimeSelection;
