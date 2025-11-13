import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../api/OrderApi';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: 'idle',
  error: null,
};

// Async thunk for creating an order
export const createNewOrder = createAsyncThunk(
  'orders/createNewOrder',
  async (orderData: Parameters<typeof orderApi.createOrder>[0], { rejectWithValue }) => {
    try {
      const newOrder = await orderApi.createOrder(orderData);
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// Async thunk for fetching user's orders
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await orderApi.getMyOrders();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewOrder.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;