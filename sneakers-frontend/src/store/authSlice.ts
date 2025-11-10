import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import apiPrivate, { apiPublic } from '../api/axios';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  authStatus: 'initializing' | 'authenticated' | 'unauthenticated';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
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
    // This request already uses withCredentials via the apiPrivate instance, but being explicit is fine.
    const response = await apiPublic.post('/auth/refresh-token', {}, { withCredentials: true });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: any, { rejectWithValue }) => {
  try {
    // --- THIS IS THE REQUIRED CHANGE ---
    // We must explicitly tell this request to handle cookies.
    const response = await apiPublic.post('/auth/login', credentials, { withCredentials: true });
    // ------------------------------------
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData: any, { rejectWithValue }) => {
  try {
    // --- ADDING THIS FOR CONSISTENCY, IN CASE REGISTRATION EVER SETS COOKIES ---
    const response = await apiPublic.post('/auth/register', userData, { withCredentials: true });
    // -------------------------------------------------------------------------
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // This uses apiPrivate, which already has withCredentials configured globally.
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

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;