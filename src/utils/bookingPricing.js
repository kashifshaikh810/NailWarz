const toNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const formatBookingCurrency = value => {
  const amount = toNumber(value);
  const absoluteAmount = Math.abs(amount);
  const rawValue = value === null || value === undefined ? amount : value;
  const rawText = String(rawValue);
  const decimalValue = rawText.includes('.') ? rawText.split('.')[1] : '';
  const decimalLength = decimalValue.replace(/[^0-9]/g, '').length;
  const formattedAmount =
    decimalLength > 0
      ? absoluteAmount.toFixed(decimalLength)
      : `${absoluteAmount}`;

  return `${amount < 0 ? '-' : ''}$${formattedAmount}`;
};

export const getDiscountDescriptor = discountDetails => {
  if (!discountDetails) {
    return '';
  }

  const type = String(discountDetails?.type || '').toLowerCase();
  const value = toNumber(discountDetails?.value, discountDetails?.amount);

  if (type === 'percentage') {
    return `${Number.isInteger(value) ? value : value.toFixed(2)}% off`;
  }

  if (type === 'fixed') {
    return `${formatBookingCurrency(value)} fixed discount`;
  }

  return 'Applied discount';
};

export const buildBookingPricingSummary = ({booking, serviceItems = []}) => {
  const serviceRows = serviceItems.map((service, index) => ({
    id: service?._id || service?.serviceId || `service-${index}`,
    title: service?.serviceName || `Service ${index + 1}`,
    amount: toNumber(service?.price),
    detail: service?.detail || '',
  }));
  const servicesTotal = serviceRows.reduce(
    (total, row) => total + toNumber(row?.amount),
    0,
  );
  const subtotal = toNumber(booking?.subtotal, servicesTotal);
  const discountDetails = booking?.discountDetails || null;
  const discountAmount = toNumber(discountDetails?.amount);
  const totalAmountFromBooking = toNumber(booking?.totalAmount, null);
  const inferredAppCharges =
    totalAmountFromBooking === null
      ? 0
      : Math.max(totalAmountFromBooking - (subtotal - discountAmount), 0);
  const appCharges = toNumber(booking?.appCharges, inferredAppCharges);
  const totalAmount = toNumber(
    booking?.totalAmount,
    subtotal - discountAmount + appCharges,
  );

  return {
    serviceRows,
    subtotal,
    discountDetails,
    discountAmount,
    discountCode: discountDetails?.code,
    discountDescriptor: getDiscountDescriptor(discountDetails),
    appCharges,
    totalAmount,
  };
};
