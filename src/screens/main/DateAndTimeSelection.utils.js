import moment from 'moment';

export const DEFAULT_SERVICE_DURATION = 30;

const DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SHORT_DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const getServiceDuration = service =>
  Number(service?.durationMinutes || service?.duration || service?.serviceDuration) ||
  DEFAULT_SERVICE_DURATION;

export const getTechnicianId = technician =>
  typeof technician === 'object' ? technician?._id : technician;

export const getTechnicianName = (technician, fallbackName) =>
  fallbackName ||
  technician?.fullName ||
  technician?.name ||
  (typeof technician === 'string' ? 'Technician' : '');

export const getNextDates = (numDays = 3) =>
  Array.from({length: numDays}, (_, index) => {
    const dateObject = new Date();
    dateObject.setDate(dateObject.getDate() + index);
    const dayIndex = dateObject.getDay();

    return {
      id: `date-${index}`,
      day: DAY_LABELS[dayIndex],
      label: SHORT_DAY_LABELS[dayIndex],
      date: dateObject.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      formattedDate: moment(dateObject).format('DD-MM-YYYY'),
    };
  });

export const convertSelectedDate = selectedDate => {
  if (!selectedDate) {
    return null;
  }

  const dateObject = new Date(selectedDate);
  if (Number.isNaN(dateObject.getTime())) {
    return null;
  }

  const dayIndex = dateObject.getDay();

  return {
    id: `custom-${moment(dateObject).format('YYYY-MM-DD')}`,
    day: DAY_LABELS[dayIndex],
    label: SHORT_DAY_LABELS[dayIndex],
    date: dateObject.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    formattedDate: moment(dateObject).format('DD-MM-YYYY'),
  };
};

const parseTimeToMinutes = value => {
  const parsedTime = moment(
    value,
    [moment.ISO_8601, 'h:mm A', 'hh:mm A', 'HH:mm'],
    true,
  );
  return parsedTime.isValid()
    ? parsedTime.hours() * 60 + parsedTime.minutes()
    : null;
};

const formatMinutes = minutes => {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  return moment()
    .startOf('day')
    .add(normalizedMinutes, 'minutes')
    .format('hh:mm A');
};

const formatRawMinutes = minutes => {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  return moment()
    .startOf('day')
    .add(normalizedMinutes, 'minutes')
    .format('HH:mm');
};

const intervalsOverlap = (startOne, endOne, startTwo, endTwo) =>
  startOne < endTwo && endOne > startTwo;

export const getLocalSlotMoment = (selectedDateFormatted, startMinutes) => {
  const selectedMoment = moment(selectedDateFormatted, 'DD-MM-YYYY', true);

  if (!selectedMoment.isValid() || !Number.isFinite(startMinutes)) {
    return null;
  }

  return selectedMoment.startOf('day').add(startMinutes, 'minutes');
};

export const isPastLocalSlot = ({selectedDateFormatted, startMinutes}) => {
  const slotMoment = getLocalSlotMoment(selectedDateFormatted, startMinutes);
  return slotMoment ? !slotMoment.isAfter(moment()) : false;
};

export const generateAvailableSlots = ({
  workingDay,
  appointments = [],
  durationMinutes,
  selectedDateFormatted,
}) => {
  if (!workingDay?.isActive) {
    return [];
  }

  const workStart = parseTimeToMinutes(workingDay?.startTime);
  const workEnd = parseTimeToMinutes(workingDay?.endTime);
  const breakStart = parseTimeToMinutes(workingDay?.breakStart);
  const breakEnd = parseTimeToMinutes(workingDay?.breakEnd);

  if (workStart === null || workEnd === null) {
    return [];
  }

  const bookedIntervals = appointments
    .map(appointment => {
      const appointmentTime =
        typeof appointment === 'string'
          ? appointment
          : appointment?.scheduledAt || appointment?.time;
      const start = parseTimeToMinutes(appointmentTime);
      const duration =
        Number(
          typeof appointment === 'object'
            ? appointment?.durationMinutes ||
                appointment?.duration ||
                appointment?.serviceDuration
            : null,
        ) || DEFAULT_SERVICE_DURATION;

      return start === null ? null : {start, end: start + duration};
    })
    .filter(Boolean);
  const availableSlots = [];

  for (
    let startMinutes = workStart;
    startMinutes + durationMinutes <= workEnd;
    startMinutes += 30
  ) {
    const endMinutes = startMinutes + durationMinutes;
    const isPastSlot = isPastLocalSlot({
      selectedDateFormatted,
      startMinutes,
    });
    const overlapsBreak =
      breakStart !== null &&
      breakEnd !== null &&
      intervalsOverlap(startMinutes, endMinutes, breakStart, breakEnd);
    const overlapsBooking = bookedIntervals.some(interval =>
      intervalsOverlap(startMinutes, endMinutes, interval.start, interval.end),
    );

    if (!isPastSlot && !overlapsBreak && !overlapsBooking) {
      availableSlots.push({
        id: formatRawMinutes(startMinutes),
        raw: formatRawMinutes(startMinutes),
        time: formatMinutes(startMinutes),
        endTime: formatMinutes(endMinutes),
        startMinutes,
        endMinutes,
      });
    }
  }

  return availableSlots;
};
