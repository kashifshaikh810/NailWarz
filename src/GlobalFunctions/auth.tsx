import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
import Toast from 'react-native-toast-message';
import { setToken, setUserData, UserLogin } from '../Redux/Slices';
import { useNavigation } from '@react-navigation/native';

export const registerUser = async (userName: string, email: string, password: string, phone: number, navigation: any) => {
  let payload: any = {
    username: userName,
  };

  if (email) {
    payload.email = email.toLowerCase();
  }
  if (password) {
    payload.password = password;
  }
  if (phone) {
    payload.phone = phone;
  }

  let data = JSON.stringify(payload);
  console.log('dattaaaadttta',data)

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
      navigation.navigate('Otp', { token: response.data.token, email, phone });
    } else {
      ShowToast('error', response.data.message);
    }
    return response.data;
  } catch (error) {
    ShowToast('error', error.response.data.message);
    throw error;
  }
};
export const ShowToast = (type: string, text: string) => {
  return Toast.show({
    type: type,
    text1: text,
  });
};
export const userLogin = async (email: string, password: string, phone: number, dispatch: any, navigation: any) => {
  const payload: any = {};
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
  console.log('data', data)

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
    if (result.payload?.success && !result.payload?.token) {
      navigation.navigate('Otp', { token: null, phone: result.payload?.phone });
    }
  }
};
export const verifyOtp = async (token: string, otp: number, phone: number, dispatch: any) => {
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
  const data = JSON.stringify(payload);
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
      if (token) {
        dispatch(setToken(token));
      } else {
        dispatch(setToken(response.data.token));
      }
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
      ShowToast('success', response.data.message);
      dispatch(setUserData(response.data?.data));
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
