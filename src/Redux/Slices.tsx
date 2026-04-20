import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { ShowToast } from '../GlobalFunctions/auth';

// Define types for initial state
interface UserState {
  userData: Record<string, any>;
  token: string;
  isLoading: boolean;
  message?: string;
  isGoogleSignIn?: boolean;
  error: string | null;
  location: {latitude: number | null; longitude: number | null; address: string};
}

const initialState: UserState = {
  userData: {},
  token: '',
  message: '',
  isGoogleSignIn: false,
  isLoading: false,
  error: null,
  location: {latitude: null, longitude: null, address: 'Fetching location...'},
};

// Define return type of API response
interface LoginResponse {
  status: string;
  token: string;
  userData: object;
}

// Async Thunk with TypeScript
// export const UserLogin = createAsyncThunk<LoginResponse, AxiosRequestConfig>(
//   'auth/UserLogin',
//   async (config, { rejectWithValue }) => {
//     try {
//       const response = await axios.request<LoginResponse>(config);
//       console.log('response===>>><<<<<<<', JSON.stringify(response.data));
//       console.log('response===>>>', response.data.token);
//       if (response.data.success) {
//         ShowToast('success', 'Login Successful');
//         return response?.data;
//       } else {
//         ShowToast('success', response?.data?.message);
//         return rejectWithValue('Login failed');
//       }
//     } catch (error: any) {
//       console.log('error', error.response.data.message);
//       ShowToast('error', error.response.data.message);
//       return rejectWithValue('Something went wrong');
//     }
//   }
// );

export const UserLogin = createAsyncThunk<LoginResponse, AxiosRequestConfig>(
  'auth/UserLogin',
  async (config, { rejectWithValue }) => {
    try {
      const response = await axios.request<LoginResponse>(config);
      const resData = response.data;

      console.log('Login Response ===>', JSON.stringify(resData));

      if (resData.success) {
        if (resData.token && resData.data) {
          ShowToast('success', 'Login Successful');
          return resData;
        } else {
          ShowToast('info', resData.message || 'OTP sent to your phone');
          return resData; // allow reducer to check for token existence
        }
      } else {
        ShowToast('error', resData?.message || 'Login failed');
        return rejectWithValue('Login failed');
      }
    } catch (error: any) {
      console.log('Login Error:', error.response?.data?.message || error.message);
      ShowToast('error', error.response?.data?.message || error.message || 'Something went wrong');
      return rejectWithValue('Something went wrong');
    }
  }
);

// Redux Slice with TypeScript
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = '';
      state.userData = {};
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsGoogleSignIn: (state, action) => {
      state.isGoogleSignIn = action.payload;
    },
    setUserData: (state, action: PayloadAction<Record<string, any>>) => {
      state.userData = action.payload;
    },
    setLocation: (state, action: PayloadAction<{latitude: number | null; longitude: number | null; address: string}>) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UserLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        // state.token = action.payload.token;
        // state.userData = action.payload.data;
        if (action.payload.token && action.payload.data) {
          state.token = action.payload.token;
          state.userData = action.payload.data;
          console.log('Login success — token & userData set');
        } else {
          // No token means OTP login initiated — no Redux update needed yet
          console.log('Phone login flow — waiting for OTP verification');
        }
        console.log('action.payload<<<<=====', action.payload);
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // ✅ Ensured `error` is always a string
      });
  },
});

export const { clearToken, setUserData, setToken, setIsGoogleSignIn, setLocation } = authSlice.actions;
export default authSlice.reducer;
