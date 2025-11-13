import apiPrivate from './axios';
import type { Order } from '../types'; // Assuming you'll add the Order type to your types/index.ts

// The data structure we'll send to create an order
interface CreateOrderPayload {
  items: any[]; // Define a more specific type based on your cart items
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  paymentId: string; // From our simulated payment
}

/**
 * Creates a new order.
 * @param {CreateOrderPayload} orderData - The data for the new order.
 */
export const createOrder = async (orderData: CreateOrderPayload): Promise<Order> => {
  const response = await apiPrivate.post('/orders', orderData);
  return response.data.data;
};

/**
 * Fetches the orders for the currently logged-in user.
 */
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await apiPrivate.get('/orders/my-orders');
  return response.data.data;
};

/**
 * (Admin) Fetches all orders in the system.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await apiPrivate.get('/orders/admin');
  return response.data.data;
};

/**
 * (Admin) Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status.
 * @param {string} [trackingNumber] - The optional tracking number.
 */
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  trackingNumber?: string
): Promise<Order> => {
  const response = await apiPrivate.put(`/orders/admin/${orderId}`, { status, trackingNumber });
  return response.data.data;
};