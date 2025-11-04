import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import apiPrivate, { apiPublic } from '../api/axios';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  // FIX: Added authStatus to track the initial session check
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  authStatus: 'initializing', // Start in an initializing state
  error: null,
};

// FIX: New async thunk to verify auth status on app load
export const verifyAuth = createAsyncThunk('auth/verifyAuth', async (_, { rejectWithValue }) => {
  try {
    // The refresh-token endpoint is perfect for this. It uses the secure cookie
    // to get a new access token and user data if the session is still valid.
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
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.authStatus = 'authenticated';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = 'unauthenticated';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.authStatus = 'unauthenticated';
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;