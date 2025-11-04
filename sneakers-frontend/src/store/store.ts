import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice'; // <-- Import

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer, // <-- Add auth reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;