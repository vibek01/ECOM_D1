import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById, type ProductFilters } from '../api/ProductApi';
import type { Product, Pagination } from '../types'; // <-- Import Pagination

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // --- ADD THIS ---
  pagination: Pagination | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: 'idle',
  error: null,
  // --- ADD THIS ---
  pagination: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await getAllProducts(filters);
      return response; // The API now returns { products, pagination }
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
        // --- MODIFIED: Store both products and pagination data ---
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // ... (fetchProductById reducers remain the same)
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