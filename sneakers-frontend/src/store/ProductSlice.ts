import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById } from '../api/ProductApi';
import type { Product } from '../types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: 'idle',
  error: null,
};

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const products = await getAllProducts();
    return products;
  } catch (error: any) {
    return rejectWithValue(error.toString());
  }
});

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id: string, { rejectWithValue }) => {
  try {
    const product = await getProductById(id);
    return product;
  } catch (error: any) {
    return rejectWithValue(error.toString());
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling for fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handling for fetching a single product
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.currentProduct = null; // Clear previous product
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;