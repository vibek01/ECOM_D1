import axios from 'axios';
import { store } from '../store/store';
// FIX: Removed direct import of `logout` from authSlice to break circular dependency
import { setAccessToken } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

export const apiPublic = axios.create({
  baseURL: API_BASE_URL,
});

const apiPrivate = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await apiPublic.post('/auth/refresh-token', {}, { withCredentials: true });
        const newAccessToken = data.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiPrivate(originalRequest);
      } catch (refreshError) {
        // FIX: Instead of dispatching logout here, we let the promise reject.
        // The UI layer will be responsible for catching this final failure and logging the user out.
        // This is a cleaner separation of concerns and solves the circular dependency.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiPrivate;