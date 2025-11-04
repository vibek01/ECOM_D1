import axios from 'axios';
import { store } from '../store/store';
import { setAccessToken, logout } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create a public Axios instance for routes that don't need authentication
export const apiPublic = axios.create({
  baseURL: API_BASE_URL,
});

// Create a private Axios instance for routes that DO need authentication
const apiPrivate = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending httpOnly cookies
});

// Request Interceptor: Add the access token to every private request
apiPrivate.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiry and refresh
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is 401 and we haven't already retried the request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried this request

      try {
        // Attempt to refresh the token
        const { data } = await apiPublic.post('/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = data.data.accessToken;

        // Update the Redux store with the new token
        store.dispatch(setAccessToken(newAccessToken));

        // Update the Authorization header for the original request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiPrivate(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        store.dispatch(logout());
        // Optionally redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiPrivate;