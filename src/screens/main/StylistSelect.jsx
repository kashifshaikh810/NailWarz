/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import AppColors from '../../utils/AppColors';
import AppHeader from '../../components/AppHeader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import Feather from 'react-native-vector-icons/Feather';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';
import {ImageBaseUrl} from '../../BaseUrl';
import {ShowToast} from '../../GlobalFunctions/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';
import APPImages from '../../assets/APPImages';
import {getServiceById} from '../../GlobalFunctions';
import {useSelector} from 'react-redux';
import {
  getAccountReviewMessage,
  isAccountUnderReview,
} from '../../utils/accountReviewRestriction';

const EmptyTechnicianList = () => (
  <View
    style={{
      paddingVertical: responsiveHeight(2.5),
      paddingHorizontal: responsiveWidth(4),
      alignItems: 'center',
    }}>
    <Feather
      name="user-x"
      size={responsiveFontSize(2.8)}
      color={AppColors.DARKGRAY}
    />
    <LineBreak space={0.7} />
    <AppText
      title="No technicians available for this service"
      textSize={1.6}
      textColor={AppColors.DARKGRAY}
      textAlignment="center"
    />
  </View>
);

const TechnicianRow = ({technician, isSelected, onPress, disabled = false}) => {
  const designation =
    technician?.designation && technician.designation !== '??'
      ? technician.designation
      : 'Nail Technician';

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.75}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: responsiveHeight(8.5),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(3.5),
        paddingVertical: responsiveHeight(1.2),
        backgroundColor: isSelected ? '#FFF4F4' : AppColors.WHITE,
        borderLeftWidth: 3,
        borderLeftColor: isSelected ? AppColors.BTNCOLOURS : 'transparent',
      }}>
      <FastImage
        source={
          technician?.image
            ? {
                uri: `${ImageBaseUrl}${technician.image}`,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }
            : APPImages.dummyImg
        }
        style={{
          width: responsiveHeight(6.2),
          height: responsiveHeight(6.2),
          borderRadius: responsiveHeight(3.1),
          backgroundColor: AppColors.WHITE2,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View
        style={{
          flex: 1,
          marginLeft: responsiveWidth(3.5),
          paddingRight: responsiveWidth(2),
        }}>
        <AppText
          title={technician?.fullName}
          textSize={1.8}
          textColor={AppColors.BLACK}
          textFontWeight
          numberOfLines={1}
        />
        <LineBreak space={0.25} />
        <AppText
          title={designation}
          textSize={1.5}
          textColor={AppColors.subTitle}
          numberOfLines={1}
        />
      </View>
      <View
        style={{
          width: responsiveHeight(3.1),
          height: responsiveHeight(3.1),
          borderRadius: responsiveHeight(1.55),
          borderWidth: 1.5,
          borderColor: isSelected
            ? AppColors.BTNCOLOURS
            : AppColors.borderColor,
          backgroundColor: isSelected ? AppColors.BTNCOLOURS : AppColors.WHITE,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isSelected ? (
          <Feather
            name="check"
            size={responsiveFontSize(1.7)}
            color={AppColors.WHITE}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const serviceDetailsCache = new Map();

const getCachedHydratedServices = (services = []) => {
  if (!Array.isArray(services) || !services.length) {
    return [];
  }
  const allCached = services.every(service => {
    const serviceId =
      service?.serviceId || service?._id || service?.service?._id;
    return serviceId && serviceDetailsCache.has(serviceId);
  });
  if (!allCached) {
    return [];
  }
  return services.map(service => {
    const serviceId =
      service?.serviceId || service?._id || service?.service?._id;
    const cachedService = serviceDetailsCache.get(serviceId);
    const freshTechnicians = cachedService?.technicianId || [];
    return {
      ...service,
      _id: cachedService?._id || serviceId,
      serviceId: cachedService?._id || serviceId,
      serviceName: cachedService?.serviceName || service?.serviceName,
      price: cachedService?.price ?? service?.price,
      categoryId: cachedService?.categoryId || service?.categoryId,
      salonId: cachedService?.salonId || service?.salonId,
      technicianId: freshTechnicians?.length
        ? freshTechnicians
        : service?.technicianId,
    };
  });
};

const StylistSelect = ({route}) => {
  const navigation = useNavigation();
  const {userData} = useSelector(state => state.user);
  const {data} = route?.params || {};
  const isMultiService = Boolean(
    data?.isMultiService && Array.isArray(data?.services),
  );

  const cachedMultiServices = useMemo(
    () => (isMultiService ? getCachedHydratedServices(data?.services) : []),
    [isMultiService, data?.services],
  );
  const cachedSingleTechs = useMemo(
    () =>
      !isMultiService &&
      data?.serviceId &&
      serviceDetailsCache.has(data.serviceId)
        ? serviceDetailsCache.get(data.serviceId)?.technicianId || []
        : [],
    [isMultiService, data?.serviceId],
  );

  const hasHydratedCache = isMultiService
    ? cachedMultiServices.length > 0
    : cachedSingleTechs.length > 0;

  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedTechniciansByService, setSelectedTechniciansByService] =
    useState({});
  const [technicianName, setTechnicianName] = useState();
  const [hydratedTechnicians, setHydratedTechnicians] =
    useState(cachedSingleTechs);
  const [hydratedServices, setHydratedServices] =
    useState(cachedMultiServices);
  const [isHydratingServices, setIsHydratingServices] = useState(
    Boolean(data?.source === 'bookAgain' && !hasHydratedCache),
  );
  const normalizeTechnician = technician => {
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

    const id = source?._id || source?.id;
    const fullName =
      source?.fullName || source?.name || source?.username || source?.title;

    if (!id || !fullName) {
      return null;
    }

    return {
      ...source,
      _id: id,
      fullName,
      designation: source?.designation || source?.role || source?.speciality,
      image: source?.image || source?.profileImage || source?.avatar,
    };
  };
  const technicians = useMemo(
    () =>
      (hydratedTechnicians.length
        ? hydratedTechnicians
        : data?.technicians || []
      )
        .map(normalizeTechnician)
        .filter(Boolean)
        .filter((technician, index, list) => {
          return (
            list.findIndex(item => item?._id === technician?._id) === index
          );
        }),
    [data?.technicians, hydratedTechnicians],
  );
  const multiServiceSource = useMemo(
    () => (hydratedServices.length ? hydratedServices : data?.services || []),
    [data?.services, hydratedServices],
  );
  const multiServiceItems = useMemo(
    () =>
      isMultiService
        ? multiServiceSource.map(service => {
            const serviceTechnicians = (service?.technicianId || [])
              .map(normalizeTechnician)
              .filter(Boolean)
              .filter((technician, index, list) => {
                return (
                  list.findIndex(item => item?._id === technician?._id) ===
                  index
                );
              });

            return {
              ...service,
              technicians: serviceTechnicians,
            };
          })
        : [],
    [isMultiService, multiServiceSource],
  );

  useEffect(() => {
    const shouldHydrateBookAgain =
      data?.source === 'bookAgain' && !hydratedTechnicians.length;

    if (
      isMultiService ||
      !data?.serviceId ||
      (technicians.length && !shouldHydrateBookAgain)
    ) {
      if (!isMultiService && isHydratingServices) {
        setIsHydratingServices(false);
      }
      return;
    }

    let isActive = true;

    const loadServiceTechnicians = async () => {
      if (shouldHydrateBookAgain && !hasHydratedCache) {
        setIsHydratingServices(true);
      }
      try {
        const response = await getServiceById(data.serviceId);
        const freshService = response?.data;
        if (freshService) {
          serviceDetailsCache.set(data.serviceId, freshService);
        }
        const serviceTechnicians = freshService?.technicianId || [];

        if (isActive) {
          setHydratedTechnicians(serviceTechnicians);
          setIsHydratingServices(false);
        }
      } catch (error) {
        console.log(
          'StylistSelect getServiceById technician hydration failed:',
          error?.response?.data || error?.message || error,
        );
        if (isActive) {
          setIsHydratingServices(false);
        }
      }
    };

    loadServiceTechnicians();

    return () => {
      isActive = false;
    };
  }, [
    data?.serviceId,
    data?.source,
    hasHydratedCache,
    hydratedTechnicians.length,
    isHydratingServices,
    isMultiService,
    technicians.length,
  ]);

  useEffect(() => {
    if (!isMultiService || data?.source !== 'bookAgain') {
      return;
    }

    let isActive = true;

    const loadBookAgainServices = async () => {
      if (!hasHydratedCache) {
        setIsHydratingServices(true);
      }
      const services = data?.services || [];

      try {
        const refreshedServices = await Promise.all(
          services.map(async service => {
            const serviceId =
              service?.serviceId || service?._id || service?.service?._id;

            if (!serviceId) {
              return service;
            }

            try {
              const response = await getServiceById(serviceId);
              const freshService = response?.data;
              if (freshService) {
                serviceDetailsCache.set(serviceId, freshService);
              }
              const freshTechnicians = freshService?.technicianId || [];

              console.log('StylistSelect bookAgain getServiceById response:', {
                serviceId,
                success: response?.success,
                technicianCount: freshTechnicians?.length || 0,
              });

              if (!freshService) {
                return service;
              }

              return {
                ...service,
                _id: freshService?._id || serviceId,
                serviceId: freshService?._id || serviceId,
                serviceName: freshService?.serviceName || service?.serviceName,
                price: freshService?.price ?? service?.price,
                categoryId: freshService?.categoryId || service?.categoryId,
                salonId: freshService?.salonId || service?.salonId,
                technicianId: freshTechnicians?.length
                  ? freshTechnicians
                  : service?.technicianId,
              };
            } catch (error) {
              console.log('StylistSelect bookAgain getServiceById failed:', {
                serviceId,
                error: error?.response?.data || error?.message || error,
              });
              return service;
            }
          }),
        );

        if (isActive) {
          setHydratedServices(refreshedServices);
          setIsHydratingServices(false);
        }
      } catch (error) {
        console.log(
          'StylistSelect bookAgain service hydration failed:',
          error?.response?.data || error?.message || error,
        );
        if (isActive) {
          setIsHydratingServices(false);
        }
      }
    };

    loadBookAgainServices();

    return () => {
      isActive = false;
    };
  }, [data?.services, data?.source, hasHydratedCache, isMultiService]);

  useEffect(() => {
    if (!data?.reschedule || isMultiService || selectedTechnician) {
      return;
    }

    const defaultTechnician =
      technicians.find(
        technician => technician?._id === data?.defaultTechnicianId,
      ) || technicians[0];

    if (!defaultTechnician) {
      return;
    }

    setSelectedTechnician(defaultTechnician?._id);
    setTechnicianName(defaultTechnician?.fullName);
  }, [
    data?.defaultTechnicianId,
    data?.reschedule,
    isMultiService,
    selectedTechnician,
    technicians,
  ]);

  const sharedSingleTechnician =
    multiServiceItems.length > 1 &&
    multiServiceItems.every(service => service?.technicians?.length === 1) &&
    multiServiceItems.every(
      service =>
        service?.technicians?.[0]?._id ===
        multiServiceItems?.[0]?.technicians?.[0]?._id,
    )
      ? multiServiceItems[0]?.technicians?.[0]
      : null;
  const allServicesHaveTechnician =
    multiServiceItems.length > 0 &&
    multiServiceItems.every(
      service => selectedTechniciansByService[service?._id]?.technicianId,
    );
  const selectedServiceCount = multiServiceItems.filter(
    service => selectedTechniciansByService[service?._id]?.technicianId,
  ).length;

  useEffect(() => {
    if (!isMultiService) {
      return;
    }

    setSelectedTechniciansByService(previous => {
      let hasChanges = false;
      const nextSelections = {...previous};

      multiServiceItems.forEach(service => {
        const preferredTechnicianId =
          service?.defaultTechnicianId ||
          service?.bookedTechnicianId ||
          service?.selectedTechnicianId;
        const preferredTechnician =
          preferredTechnicianId &&
          service?.technicians?.find(
            technician => technician?._id === preferredTechnicianId,
          );
        const autoSelectableTechnician =
          preferredTechnician ||
          (service?.technicians?.length === 1 ? service.technicians[0] : null);

        if (
          autoSelectableTechnician &&
          !nextSelections[service?._id]?.technicianId
        ) {
          const technician = autoSelectableTechnician;
          nextSelections[service?._id] = {
            serviceId: service?._id,
            serviceName: service?.serviceName,
            technicianId: technician?._id,
            technicianName: technician?.fullName,
            technician,
          };
          hasChanges = true;
        }
      });

      return hasChanges ? nextSelections : previous;
    });
  }, [isMultiService, multiServiceItems]);

  useEffect(() => {
    if (isMultiService || selectedTechnician || data?.source !== 'bookAgain') {
      return;
    }

    const preferredTechnicianId =
      data?.defaultTechnicianId ||
      data?.bookedTechnicianId ||
      data?.selectedTechnicianId;
    const preferredTechnician =
      preferredTechnicianId &&
      technicians.find(technician => technician?._id === preferredTechnicianId);
    const fallbackTechnician =
      preferredTechnician || (technicians.length === 1 ? technicians[0] : null);

    if (!fallbackTechnician) {
      return;
    }

    setSelectedTechnician(fallbackTechnician?._id);
    setTechnicianName(fallbackTechnician?.fullName);
  }, [
    data?.bookedTechnicianId,
    data?.defaultTechnicianId,
    data?.selectedTechnicianId,
    data?.source,
    isMultiService,
    selectedTechnician,
    technicians,
  ]);

  useEffect(() => {
    if (!data?.reschedule) {
      return;
    }

    console.log('STYLIST_SELECT_RECEIVED_RESCHEDULE_DATA', {
      salonId: data?.salonId,
      saloonId: data?.saloonId,
      serviceId: data?.serviceId,
      serviceDetailId: data?.serviceDetailId,
      appointmentServiceId: data?.appointmentServiceId,
      serviceName: data?.serviceName,
      price: data?.price,
      isMultiService: data?.isMultiService,
      reschedule: data?.reschedule,
      myBookingId: data?.myBookingId,
      originalDate: data?.originalDate,
      defaultTechnicianId: data?.defaultTechnicianId,
      rawTechnicianCount: data?.technicians?.length || 0,
      technicianIds: data?.technicians?.map(
        technician => technician?._id || technician?.id,
      ),
    });
  }, [data]);

  const handleSelectServiceTechnician = (service, technician) => {
    setSelectedTechniciansByService(previous => ({
      ...previous,
      [service?._id]: {
        serviceId: service?._id,
        serviceName: service?.serviceName,
        technicianId: technician?._id,
        technicianName: technician?.fullName,
        technician,
      },
    }));
  };

  const handleContinueMultiService = () => {
    if (!data?.reschedule && isAccountUnderReview(userData)) {
      Alert.alert('Account Under Review', getAccountReviewMessage(userData), [
        {text: 'OK'},
      ]);
      return;
    }

    const resolvedSalonId =
      data?.salonId ||
      data?.saloonId ||
      multiServiceItems.find(service => service?.salonId)?.salonId ||
      multiServiceItems.find(service => service?.saloonId)?.saloonId;
    const selections = multiServiceItems.map(service => ({
      serviceId: service?._id,
      slotId:
        service?.slotId ||
        service?.serviceDetailId ||
        service?.appointmentServiceId,
      serviceDetailId:
        service?.serviceDetailId ||
        service?.slotId ||
        service?.appointmentServiceId,
      appointmentServiceId:
        service?.appointmentServiceId ||
        service?.slotId ||
        service?.serviceDetailId,
      scheduledAt: service?.scheduledAt,
      serviceName: service?.serviceName,
      salonId: resolvedSalonId || service?.salonId || service?.saloonId,
      price: service?.price,
      durationMinutes:
        Number(
          service?.durationMinutes ||
            service?.duration ||
            service?.serviceDuration,
        ) || 30,
      selectedTechnicianId:
        selectedTechniciansByService[service?._id]?.technicianId,
      selectedTechnicianName:
        selectedTechniciansByService[service?._id]?.technicianName,
      selectedTechnician:
        selectedTechniciansByService[service?._id]?.technician,
    }));
    const payload = {
      ...data,
      salonId: resolvedSalonId,
      saloonId: resolvedSalonId,
      serviceIds: multiServiceItems.map(service => service?._id),
      serviceId: multiServiceItems.map(service => service?._id),
      technicianIds: selections.map(item => item.selectedTechnicianId),
      selectedTechnician: selections?.[0]?.selectedTechnicianId,
      technicianNames: selections.map(item => item.selectedTechnicianName),
      technicianName: [
        ...new Set(selections.map(item => item.selectedTechnicianName)),
      ]
        .filter(Boolean)
        .join(', '),
      serviceName: multiServiceItems
        .map(service => service?.serviceName)
        .filter(Boolean)
        .join(', '),
      price:
        data?.totalPrice ??
        multiServiceItems.reduce((sum, service) => {
          return sum + (Number(service?.price) || 0);
        }, 0),
      serviceTechnicianSelections: selections,
    };

    console.log('Multi service technician selection payload:', payload);
    console.log(
      'Multi service selected technicians by service:',
      selectedTechniciansByService,
    );

    navigation.navigate('DateAndTimeSelection', {
      data: payload,
    });
  };
  // technicians, saloonId, serviceName, price, serviceId
  console.log('selectedTechnician', selectedTechnician);
  console.log('StylistSelect route data summary', {
    saloonId: data?.saloonId,
    serviceId: data?.serviceId,
    serviceName: data?.serviceName,
    isMultiService,
    serviceCount: multiServiceItems.length,
    rawTechnicianCount: data?.technicians?.length || 0,
    normalizedTechnicianCount: technicians.length,
    firstRawTechnicianKeys:
      data?.technicians?.[0] && typeof data.technicians[0] === 'object'
        ? Object.keys(data.technicians[0])
        : typeof data?.technicians?.[0],
    firstNormalizedTechnician: technicians[0],
  });
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        style={{flex: 1, backgroundColor: AppColors.WHITE}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(12),
        }}>
        <AppHeader
          onPress={() => navigation.goBack()}
          title={isMultiService ? 'Select Technicians' : 'Select Technician'}
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
            paddingHorizontal: responsiveWidth(4),
            paddingTop: responsiveHeight(2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: responsiveHeight(2),
            }}>
            <View style={{flex: 1, paddingRight: responsiveWidth(3)}}>
              <AppText
                title={
                  isMultiService
                    ? 'Choose a technician for each service'
                    : 'Choose your preferred nail technician'
                }
                textSize={1.9}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <LineBreak space={0.35} />
              <AppText
                title={
                  isMultiService
                    ? `${multiServiceItems.length} services in this booking`
                    : `${technicians.length} technicians available`
                }
                textSize={1.5}
                textColor={AppColors.subTitle}
              />
            </View>
            {isMultiService ? (
              <View
                style={{
                  backgroundColor: '#FFF1F1',
                  paddingHorizontal: responsiveWidth(3),
                  paddingVertical: responsiveHeight(0.8),
                  borderRadius: responsiveHeight(2),
                }}>
                <AppText
                  title={`${selectedServiceCount}/${multiServiceItems.length} selected`}
                  textSize={1.4}
                  textColor={AppColors.BTNCOLOURS}
                  textFontWeight
                />
              </View>
            ) : null}
          </View>

          {!isMultiService ? (
            <>
              <AppText
                title="Available technicians"
                textSize={1.7}
                textColor={AppColors.BLACK}
                textFontWeight
              />
              <LineBreak space={1} />
            </>
          ) : null}

          {isHydratingServices ? (
            <View
              style={{
                paddingVertical: responsiveHeight(15),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={AppColors.BTNCOLOURS} />
            </View>
          ) : isMultiService ? (
            <View style={{gap: responsiveHeight(2)}}>
              {sharedSingleTechnician ? (
                <View
                  style={{
                    backgroundColor: AppColors.WHITE,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E8E8E8',
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      paddingHorizontal: responsiveWidth(4),
                      paddingTop: responsiveHeight(1.7),
                      paddingBottom: responsiveHeight(1.2),
                    }}>
                    <AppText
                      title="One technician covers all services"
                      textSize={1.8}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                    <LineBreak space={0.8} />
                    {multiServiceItems.map(service => (
                      <View
                        key={service?._id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: responsiveHeight(0.6),
                        }}>
                        <AppText
                          title={service?.serviceName}
                          textSize={1.5}
                          textColor={AppColors.subTitle}
                          numberOfLines={1}
                        />
                        <AppText
                          title={`$${service?.price || 0}`}
                          textSize={1.5}
                          textColor={AppColors.subTitle}
                        />
                      </View>
                    ))}
                  </View>
                  <View style={{height: 1, backgroundColor: '#ECECEC'}} />
                  <TechnicianRow
                    technician={sharedSingleTechnician}
                    isSelected
                    disabled
                  />
                </View>
              ) : (
                multiServiceItems.map(service => {
                  return (
                    <View
                      key={service?._id}
                      style={{
                        backgroundColor: AppColors.WHITE,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E8E8E8',
                        overflow: 'hidden',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: responsiveWidth(4),
                          paddingVertical: responsiveHeight(1.6),
                          backgroundColor: '#FCFCFC',
                        }}>
                        <View
                          style={{flex: 1, paddingRight: responsiveWidth(2)}}>
                          <AppText
                            title={service?.serviceName}
                            textSize={1.9}
                            textColor={AppColors.BLACK}
                            textFontWeight
                            numberOfLines={1}
                          />
                          <AppText
                            title={`$${service?.price || 0} • 30 Mins`}
                            textSize={1.5}
                            textColor={AppColors.subTitle}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: responsiveWidth(2.5),
                            paddingVertical: responsiveHeight(0.6),
                            borderRadius: responsiveHeight(2),
                            backgroundColor: selectedTechniciansByService[
                              service?._id
                            ]
                              ? '#EAF8EF'
                              : '#F1F1F1',
                          }}>
                          {selectedTechniciansByService[service?._id] ? (
                            <Feather
                              name="check"
                              size={responsiveFontSize(1.4)}
                              color={AppColors.GREEN}
                            />
                          ) : null}
                          <AppText
                            title={
                              selectedTechniciansByService[service?._id]
                                ? 'Selected'
                                : 'Required'
                            }
                            textSize={1.3}
                            textColor={
                              selectedTechniciansByService[service?._id]
                                ? AppColors.GREEN
                                : AppColors.subTitle
                            }
                            textFontWeight
                            styles={{
                              marginLeft: selectedTechniciansByService[
                                service?._id
                              ]
                                ? responsiveWidth(1)
                                : 0,
                            }}
                          />
                        </View>
                      </View>

                      {service?.technicians?.length ? (
                        <View>
                          {service.technicians.map((technician, index) => {
                            const isSelected =
                              selectedTechniciansByService[service?._id]
                                ?.technicianId === technician?._id;

                            return (
                              <React.Fragment
                                key={`${service?._id}-${technician?._id}`}>
                                {index > 0 ? (
                                  <View
                                    style={{
                                      height: 1,
                                      marginLeft: responsiveWidth(13),
                                      backgroundColor: '#EEEEEE',
                                    }}
                                  />
                                ) : null}
                                <TechnicianRow
                                  technician={technician}
                                  isSelected={isSelected}
                                  onPress={() =>
                                    handleSelectServiceTechnician(
                                      service,
                                      technician,
                                    )
                                  }
                                />
                              </React.Fragment>
                            );
                          })}
                        </View>
                      ) : (
                        <EmptyTechnicianList />
                      )}
                    </View>
                  );
                })
              )}
            </View>
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E8E8E8',
                borderRadius: 12,
                overflow: 'hidden',
              }}>
              {technicians.length ? (
                technicians.map((technician, index) => (
                  <React.Fragment key={technician?._id}>
                    {index > 0 ? (
                      <View
                        style={{
                          height: 1,
                          marginLeft: responsiveWidth(13),
                          backgroundColor: '#EEEEEE',
                        }}
                      />
                    ) : null}
                    <TechnicianRow
                      technician={technician}
                      isSelected={selectedTechnician === technician?._id}
                      onPress={() => {
                        setSelectedTechnician(technician?._id);
                        setTechnicianName(technician?.fullName);
                      }}
                    />
                  </React.Fragment>
                ))
              ) : (
                <EmptyTechnicianList />
              )}
            </View>
          )}

          {!isHydratingServices ? (
            <>
              <LineBreak space={3} />

              <AppButton
                disabled={
                  isMultiService
                    ? !allServicesHaveTechnician
                    : !selectedTechnician
                }
                title="Continue"
                style={{
                  minHeight: responsiveHeight(6.2),
                  borderRadius: 12,
                }}
                bgColor={
                  (isMultiService
                    ? allServicesHaveTechnician
                    : selectedTechnician)
                    ? AppColors.BTNCOLOURS
                    : '#CCCCCC'
                }
                handlePress={() => {
                  if (!data?.reschedule && isAccountUnderReview(userData)) {
                    Alert.alert(
                      'Account Under Review',
                      getAccountReviewMessage(userData),
                      [{text: 'OK'}],
                    );
                    return;
                  }

                  if (isMultiService) {
                    if (allServicesHaveTechnician) {
                      handleContinueMultiService();
                    } else {
                      return ShowToast(
                        'error',
                        'Please select a technician for each service.',
                      );
                    }
                    return;
                  }

                  if (selectedTechnician) {
                    const resolvedTechnician = technicians.find(
                      technician => technician?._id === selectedTechnician,
                    );
                    const resolvedTechnicianName =
                      technicianName ||
                      resolvedTechnician?.fullName ||
                      'Technician';

                    navigation.navigate('DateAndTimeSelection', {
                      data: {
                        ...data,
                        selectedTechnician,
                        selectedTechnicianData: resolvedTechnician,
                        technicianName: resolvedTechnicianName,
                      },
                    });
                  } else {
                    return ShowToast('error', 'Plz Select A Stylist To Proceed');
                  }
                }}
              />
              <LineBreak space={2} />
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StylistSelect;
