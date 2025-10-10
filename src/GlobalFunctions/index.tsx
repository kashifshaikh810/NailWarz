import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ShowToast } from './auth';

export const getSaloons = async ({
  latitude,
  longitude,
  categoryId,
  saloonName,
}: {
  latitude?: number;
  longitude?: number;
  saloonName?: string;
  categoryId?: string;
}) => {
  const params = new URLSearchParams();
  if (latitude) params.append('latitude', latitude);
  if (longitude) params.append('longitude', longitude);
  if (saloonName) params.append('salonName', saloonName);
  if (categoryId) params.append('categoryId', categoryId);

  console.log('params', params.toString());

  const config = {
    method: 'get',
    url: `${BaseUrl}getSalons?${params.toString()}`,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllSaloons = async ({
  saloonName,
  categoryId,
}: {
  saloonName?: string;
  categoryId?: string;
}) => {
  const params = new URLSearchParams();
  if (saloonName) params.append('salonName', saloonName);
  if (categoryId) params.append('categoryId', categoryId);

  console.log('params', params.toString());
  const config = {
    method: 'get',
    url: `${BaseUrl}getSalons?${params.toString()}`,
    headers: {},
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getSaloonById = async (saloonId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAdminById?salonId=${saloonId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllCategories = async () => {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllCategories`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getTechnicianById = async (technicianId: string, date: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getTechnicianById?id=${technicianId}&date=${date}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    console.log('responsedasdfs.data', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAvailableTechnician = async (serviceId: string, date: string, time: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAvailableTechnician?serviceId=${serviceId}&date=${date}&time=${time}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);

    return response?.data;
  } catch (error) {
    ShowToast('error', error?.response?.data?.message);

    throw error;
  }
};
export const getServiceByCategoryId = async (categoryId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllServicesBySalonId?categoryId=${categoryId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getServiceBySalonAndCategoryId = async (categoryId: string, salonId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllServicesBySalonId?salonId=${salonId}&categoryId=${categoryId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const selectImage = async (source = 'gallery') => {
  try {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let result;
    if (source === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }

    if (result.didCancel) {
      console.log('User cancelled image picker');
      return null;
    } else if (result.errorMessage) {
      console.log('ImagePicker Error: ', result.errorMessage);
      return null;
    } else {
      return result.assets?.[0]?.uri || null;
    }
  } catch (error) {
    console.log('Error selecting image:', error);
    return null;
  }
};
export const createPost = async (
  userId: string,
  Post_Image: any,
  Post_Caption: string,
  Post_Type: string,
  navigation: any,
) => {
  let data = new FormData();
  data.append('userId', userId);
  data.append('Post_Image', {
    uri: Post_Image,
    name: 'image.jpg',
    type: 'image/jpeg',
  });
  data.append('Post_Caption', Post_Caption);
  data.append('Post_Type', Post_Type);
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}CreatePost`,
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log('Post Response:', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      navigation.goBack();
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);

    console.error(
      'Error creating post:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
export const getAllPosts = async () => {
  let data = '';
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllPost`,
    headers: {},
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (response.data.success) {
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);
    throw error;
  }
};
export const getPostById = async (postId: string) => {
  let data = '';
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getPostById?post_id=${postId}`,
    headers: {},
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (!response.data.success) {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);
    throw error;
  }
};
export const likePost = async (likeId: string, postId: string) => {
  let data = JSON.stringify({
    'likeId': likeId,
    'post_id': postId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}LikePost`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (!response.data.success) {
      ShowToast('error', response?.data?.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error?.response?.data?.message);

    throw error;
  }
};
export const commentPost = async (userId: string, postId: string, message: string) => {
  let data = JSON.stringify({
    'userId': userId,
    'post_id': postId,
    'message': message,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}CommentPost`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sharePost = async (userId: string, postId: string, message: string) => {
  let data = JSON.stringify({
    'userId': userId,
    'post_id': postId,
    'message': message,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}SharePost`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    if (response.data.success) {
      ShowToast('success', response?.data?.message);
    } else {
      ShowToast('error', response?.data?.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error?.response?.data?.message);

    throw error;
  }
};
export const createBooking = async (userId: string, salonId: string, serviceId: string, technicianId: string, date: string, time: string,amount:number) => {
  let data = JSON.stringify({
    'userId': userId,
    'salonId': salonId,
    'serviceId': serviceId,
    'technicianId': technicianId,
    'date': date,
    'time': time,
    'totalAmount': amount,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}createBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateBooking = async (bookingId: string, technicianId: string, time: string, date: string) => {
  let data = JSON.stringify({
    'bookingId': bookingId,
    'technicianId': technicianId,
    'time': time,
    'date': date,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}updateBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getBookingsByIdAndStatus = async (userId: string, status: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getBookingsByUserIdAndStatus?userId=${userId}&status=${status}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelBooking = async (bookingId: string) => {
  let data = JSON.stringify({
    'bookingId': bookingId,
    'status': 'Canceled',
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}updateBooking`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelBookingStatus = async (bookingId: string) => {
  let data = JSON.stringify({
    'bookingId': bookingId,
    'status': 'Canceled',
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}updateBookingStatusByUser`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getBookingById = async (bookingId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://predemo.site/Nailwarz/api/getBookingById?bookingId=${bookingId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const addToFavourite = async (userId: string, salonId: string) => {
  let data = JSON.stringify({
    'userId': userId,
    'salonId': salonId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}addFavouriteSalon`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllFvrtsByUserId = async (userId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllFavSalonByUserId?userId=${userId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const addReviews = async (salonId: string, userId: string, stars: number, message: string) => {
  let data = JSON.stringify({
    'salonId': salonId,
    'userId': userId,
    'stars': stars,
    'message': message,
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}giveRatingToSalon`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }

};
export const getAllReviews = async (salonId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getRatingBySalonOrStar?salonId=${salonId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    ShowToast('error', error?.response?.data?.message);
    throw error;
  }
};
export const getAllBattles = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getAllBattle`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getBattleById = async (battleId: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getBattleById?battleId=${battleId}`,
    headers: {},
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const addVote = async (battleId: string, salonId: string, userId: string) => {
  let data = JSON.stringify({
    'battleId': battleId,
    'salonId': salonId,
    'userId': userId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}addOrRemoveVotes`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const createCustomer = async (token: string) => {
  let data = '';
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}createOrGetCustomer`,
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const attachCard = async (paymentMethodId: string, token: string) => {
  let data = JSON.stringify({
    'paymentMethodId': paymentMethodId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}attachCard`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getSavedCards = async (token: string) => {
  let data = '';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getSavedCards`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createPayment = async (bookingId: string, amount: number, currency: string, saveCard: boolean, paymentMethodId: string, token: string) => {
  let data = JSON.stringify({
    'bookingId': bookingId,
    'amount': amount,
    'currency': currency,
    'saveCard': saveCard,
    'paymentMethodId': paymentMethodId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://predemo.site/Nailwarz/api/createPaymentIntent',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getAllNotifications = async (userId: string) => {
  let data = '';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getNotificationsByUserId?userId=${userId}`,
    headers: {},
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getWalletByUserId = async (token: string) => {
  let data = '';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BaseUrl}getWalletByUserId`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const payWithWallet = async (userId: string, bookingId: string, bookingAmount: number) => {
  let data = JSON.stringify({
    'userId': userId,
    'bookingId': bookingId,
    'bookingAmount': bookingAmount,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}paymentWithWallet`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
