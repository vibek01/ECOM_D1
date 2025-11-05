import { apiPublic } from './axios';

/**
 * Fetches all products from the backend.
 */
export const getAllProducts = async () => {
  const response = await apiPublic.get('/products');
  return response.data.data;
};

/**
 * Fetches a single product by its ID from the backend.
 * @param {string} id - The ID of the product to fetch.
 */
export const getProductById = async (id: string) => {
  // FIX: Ensured backticks (`) are used for the template literal string,
  // not forward slashes (/). This makes it a valid string URL.
  const response = await apiPublic.get(`/products/${id}`);
  return response.data.data;
};