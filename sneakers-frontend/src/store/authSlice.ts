import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import apiPrivate, { apiPublic } from '../api/axios';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated'; // For the persistent session
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For individual actions like login/register
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  authStatus: 'initializing',
  status: 'idle',
  error: null,
};

export const verifyAuth = createAsyncThunk('auth/verifyAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await apiPublic.post('/auth/refresh-token', {}, { withCredentials: true });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await apiPublic.post('/auth/login', credentials);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await apiPublic.post('/auth/register', userData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await apiPrivate.post('/auth/logout');
  return;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.authStatus = 'unauthenticated';
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify Auth
      .addCase(verifyAuth.pending, (state) => {
        state.authStatus = 'initializing';
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authStatus = 'authenticated';
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.authStatus = 'unauthenticated';
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authStatus = 'authenticated';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.authStatus = 'unauthenticated';
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.authStatus = 'unauthenticated';
        state.status = 'idle';
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;