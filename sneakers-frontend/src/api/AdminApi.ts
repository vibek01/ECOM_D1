import apiPrivate from './axios';
import type { Order } from '../types';

// Define the shape of the data we expect from the backend
export interface DashboardStats {
  totalRevenue: number;
  newCustomers: number;
  pendingOrders: number;
  totalProducts: number;
  recentOrders: Order[];
}

/**
 * (Admin) Fetches the aggregated statistics for the main dashboard.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiPrivate.get('/admin/stats');
  return response.data.data;
};