import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById, type ProductFilters } from '../api/ProductApi';
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

// --- MODIFIED: Thunk now accepts filters ---
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      const products = await getAllProducts(filters);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

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
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.currentProduct = null;
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