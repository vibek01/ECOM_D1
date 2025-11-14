import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById, type ProductFilters } from '../api/ProductApi';
import type { Product, Pagination } from '../types';

// The shape of our state within the Redux store
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: Pagination | null; // <-- ADDED
}

// The initial state when the app loads
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  status: 'idle',
  error: null,
  pagination: null, // <-- ADDED
};

// Async thunk for fetching a paginated list of products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      // The API now returns an object: { products: [...], pagination: {...} }
      const response = await getAllProducts(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

// Async thunk for fetching a single product by its ID
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
  // Handlers for the async thunks
  extraReducers: (builder) => {
    builder
      // Reducers for fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // --- MODIFIED: Store both products and pagination data from the payload ---
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Reducers for fetchProductById (Unchanged)
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