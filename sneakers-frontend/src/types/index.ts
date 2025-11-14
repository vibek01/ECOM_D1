// No changes to User or CartItem

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  imageUrl: string;
}

export interface Product {
  id:string;
  name: string;
  brand: string;
  description: string;
  price: number;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // Composite ID: `${productId}-${variantId}`
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  paymentId?: string;
  paymentStatus?: string;
}

export interface Order {
  id: string;
  user: string | { username: string; email: string }; // User might be populated
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentDetails: PaymentDetails;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// --- THIS IS THE MISSING PIECE ---
// Add this interface to define the shape of the pagination data
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}