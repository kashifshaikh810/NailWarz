const flattenValue = value => {
  if (Array.isArray(value)) {
    return value.reduce((items, item) => [...items, ...flattenValue(item)], []);
  }

  return value ? [value] : [];
};

const resolveServiceId = service => {
  return (
    service?.serviceId ||
    service?.service?._id ||
    service?._id ||
    service?.id ||
    null
  );
};

const resolveServiceDetailId = service => {
  return (
    service?.slotId ||
    service?.serviceDetailId ||
    service?.appointmentServiceId ||
    (service?.service?._id ? service?._id : null)
  );
};

const resolveTechnicians = service => {
  const technicians =
    service?.technicians ||
    service?.technicianId ||
    service?.service?.technicianId ||
    (service?.technician ? [service.technician] : []);

  return flattenValue(technicians).filter(Boolean);
};

const compactTechnician = technician => {
  if (!technician || typeof technician !== 'object') {
    return null;
  }

  const source =
    technician?.technicianId && typeof technician.technicianId === 'object'
      ? technician.technicianId
      : technician?.technician && typeof technician.technician === 'object'
      ? technician.technician
      : technician?.userId && typeof technician.userId === 'object'
      ? technician.userId
      : technician;
  const technicianId = source?._id || source?.id;
  const fullName =
    source?.fullName || source?.name || source?.username || source?.title;

  if (!technicianId || !fullName) {
    return null;
  }

  return {
    _id: technicianId,
    fullName,
    designation: source?.designation || source?.role || source?.speciality,
    image: source?.image || source?.profileImage || source?.avatar,
  };
};

const compactTechnicians = technicians => {
  return flattenValue(technicians)
    .map(compactTechnician)
    .filter(Boolean)
    .filter((technician, index, list) => {
      return list.findIndex(item => item?._id === technician?._id) === index;
    });
};

const normalizeServiceForSelection = (service, resolvedSalonId) => {
  const serviceId = resolveServiceId(service);
  const serviceDetailId = resolveServiceDetailId(service);
  const technicians = compactTechnicians(resolveTechnicians(service));
  const bookedTechnician = compactTechnician(
    service?.bookedTechnician ||
      service?.selectedTechnician ||
      service?.technician,
  );

  return {
    _id: serviceId,
    serviceId,
    slotId: serviceDetailId,
    serviceDetailId,
    appointmentServiceId: serviceDetailId,
    serviceName: service?.serviceName || service?.service?.serviceName,
    price: service?.price ?? service?.service?.price,
    categoryId: service?.categoryId || service?.service?.categoryId,
    salonId:
      service?.salonId ||
      service?.saloonId ||
      service?.service?.salonId ||
      resolvedSalonId,
    technicianId: technicians,
    bookedTechnicianId: bookedTechnician?._id,
    bookedTechnicianName: bookedTechnician?.fullName,
    bookedTechnician,
    durationMinutes:
      service?.durationMinutes ||
      service?.duration ||
      service?.serviceDuration ||
      service?.service?.durationMinutes ||
      service?.service?.duration ||
      service?.service?.serviceDuration,
  };
};

export const buildBookingServiceSelectionPayload = ({
  salonId,
  saloonId,
  services = [],
  isMultiService,
  reschedule = false,
  myBookingId = null,
  originalDate,
  extra = {},
}) => {
  const sourceServices = flattenValue(services).filter(
    service => service && typeof service === 'object',
  );
  const resolvedSalonId =
    salonId ||
    saloonId ||
    sourceServices.find(service => service?.salonId)?.salonId ||
    sourceServices.find(service => service?.saloonId)?.saloonId ||
    sourceServices.find(service => service?.service?.salonId)?.service?.salonId;
  const normalizedServices = sourceServices
    .map(service => normalizeServiceForSelection(service, resolvedSalonId))
    .filter(service => service?._id);
  const totalPrice = normalizedServices.reduce(
    (total, service) => total + (Number(service?.price) || 0),
    0,
  );
  const shouldUseMultiService =
    typeof isMultiService === 'boolean'
      ? isMultiService
      : normalizedServices.length > 1;

  if (!shouldUseMultiService) {
    const service = normalizedServices[0] || {};

    return {
      salonId: resolvedSalonId,
      saloonId: resolvedSalonId,
      serviceId: service?._id,
      slotId:
        service?.slotId || service?.serviceDetailId || service?.appointmentServiceId,
      serviceDetailId: service?.serviceDetailId,
      appointmentServiceId: service?.appointmentServiceId,
      serviceName: service?.serviceName,
      price: service?.price,
      technicians: service?.technicianId || [],
      defaultTechnicianId: service?.bookedTechnicianId,
      defaultTechnicianName: service?.bookedTechnicianName,
      durationMinutes: service?.durationMinutes,
      isMultiService: false,
      reschedule,
      myBookingId,
      originalDate,
      ...extra,
    };
  }

  return {
    salonId: resolvedSalonId,
    saloonId: resolvedSalonId,
    serviceIds: normalizedServices.map(service => service?._id).filter(Boolean),
    serviceNames: normalizedServices
      .map(service => service?.serviceName)
      .filter(Boolean),
    services: normalizedServices,
    totalPrice,
    serviceCount: normalizedServices.length,
    isMultiService: true,
    reschedule,
    myBookingId,
    originalDate,
    ...extra,
  };
};
