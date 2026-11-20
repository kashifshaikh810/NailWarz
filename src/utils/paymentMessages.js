import moment from 'moment';

const ISO_DATE_TIME_PATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g;
const UTC_DATE_STRING_PATTERN =
  /[A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(Coordinated Universal Time\)/g;

const formatDateTimeForMessage = value => {
  const parsed = moment(
    value,
    [
      moment.ISO_8601,
      'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(Coordinated Universal Time)]',
      'ddd MMM D YYYY HH:mm:ss [GMT]ZZ [(Coordinated Universal Time)]',
    ],
    true,
  );
  const fallbackParsed = parsed.isValid() ? parsed : moment(value);

  return fallbackParsed.isValid()
    ? fallbackParsed.local().format('ddd, MMM D [at] h:mm A')
    : value;
};

export const formatPaymentMessageDateTimes = message => {
  if (!message) {
    return '';
  }

  return `${message}`
    .replace(UTC_DATE_STRING_PATTERN, formatDateTimeForMessage)
    .replace(ISO_DATE_TIME_PATTERN, formatDateTimeForMessage);
};
