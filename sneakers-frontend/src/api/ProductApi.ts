import { apiPublic } from './axios';

// A type for our filter parameters for clarity
export interface ProductFilters {
  search?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

/**
 * Fetches all products from the backend, applying any provided filters.
 */
export const getAllProducts = async (filters: ProductFilters = {}) => {
  // Remove empty keys to keep the URL clean
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null)
  );
  
  const response = await apiPublic.get('/products', {
    params: activeFilters,
  });
  return response.data.data;
};

/**
 * Fetches a single product by its ID from the backend.
 * @param {string} id - The ID of the product to fetch.
 */
export const getProductById = async (id: string) => {
  const response = await apiPublic.get(`/products/${id}`);
  return response.data.data;
};