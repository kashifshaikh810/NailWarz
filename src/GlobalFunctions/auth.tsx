import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import Toast from 'react-native-toast-message';
import { setToken, setUserData, UserLogin } from '../Redux/Slices';
import { useNavigation } from '@react-navigation/native';

export const registerUser = async (userName: string, email: string, password: string, phone: number, fcmToken: string, navigation: any) => {
  let payload: any = {
    username: userName,
    FCMToken: fcmToken,

  };

  if (email) {
    payload.email = email.toLowerCase();
  }
  if (password) {
    payload.password = password;
  }
  if (phone) {
    payload.phone = Number(phone);
  }

  let data = JSON.stringify(payload);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}SignupWithEmailOrPhoneandPassword`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  try {
    const response = await axios.request(config);
    console.log('response.data', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      navigation.navigate('Otp', { token: response.data.token, email, phone, forgotPassword: false });
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    console.log('errorr', error.response.data);
    ShowToast('error', error.response.data.message);
    throw error;
  }
};
export const signInWithGoogle = async (userName: string, email: string, fcmToken: string) => {
  let data = JSON.stringify({
    'username': userName,
    'email': email,
    'FCMToken': fcmToken,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}signUpOrLoginWithGoogle`,
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

export const ShowToast = (type: string, text: string) => {
  return Toast.show({
    type: type,
    text1: text,
  });
};
export const userLogin = async (email: string, password: string, phone: number, fcmtoken: string, dispatch: any, navigation: any) => {
  let payload: any = {
    FCMToken: fcmtoken,
  };

  if (email) {
    payload.email = email.toLowerCase();
  }
  if (password) {
    payload.password = password;
  }
  if (phone) {
    payload.phone = Number(phone);
  }

  const data = JSON.stringify(payload);
  console.log('data', data);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}loginWitheEmailAndPassword`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  if (email) {
    await dispatch(UserLogin(config));
  } else {
    const result: any = await dispatch(UserLogin(config));
    console.log('response', result);
    if (result.payload?.success) {
      navigation.navigate('Otp', { token: null, phone: result.payload?.phone, forgotPassword: false });
    }
  }
};
export const verifyOtp = async (token: string, otp: number, phone: number, email: string, dispatch: any) => {
  // let data = JSON.stringify({
  //   'token': token,
  //   'otp': otp,
  // });
  let payload: any = {
    otp: otp,
  };
  if (token) {
    payload.token = token;
  }
  if (phone) {
    payload.phone = Number(phone);
  }
  if (email) {
    payload.email = email;
  }
  const data = JSON.stringify(payload);
  console.log('dataa', data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}VerifyOtpAndCreate`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  console.log('data', data);
  console.log('config', config);

  try {
    const response = await axios.request(config);
    console.log('response.data', response.data);
    if (response.data.success) {
      ShowToast('success', response.data.message);
      dispatch(setUserData(response.data?.data));
      dispatch(setToken(response.data.token));
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const editProfile = async (
  userId: string,
  username: string,
  image: any,
  navigation: any,
  dispatch: any,
  stripeCustomerId: string,
  showToast?: boolean,
  notify?: boolean,
) => {
  let data = new FormData();
  data.append('userId', userId);
  if (username) {
    data.append('username', username);
  }
  if (image) {
    data.append('image', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  }
  if (stripeCustomerId) {
    data.append('stripeCustomerId', stripeCustomerId);
  }
  if (notify !== null) {
    data.append('notify', notify);
  }
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}updateUserById`,
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
      if (showToast) {
        ShowToast('success', response.data.message);
      }
      dispatch(setUserData(response.data?.data));
      if (navigation) {
        navigation.goBack();
      }
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
export const forgotPasswordIntegration = async (email: string) => {
  let data = JSON.stringify({
    'email': email,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}forgetPasswordOtpUser`,
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
export const verifyPasswordOtp = async (email: string, otp: number) => {
  let data = JSON.stringify({
    'email': email,
    'Otp': otp,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}verifyOtp`,
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
export const setNewPassword = async (email: string, newPass: string) => {
  let data = JSON.stringify({
    'email': email,
    'newPassword': newPass,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}setNewPasswordByUser`,
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
export const deleteUser = async (userId: string) => {
  let data = JSON.stringify({
    'userId': userId,
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BaseUrl}deleteUser`,
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
