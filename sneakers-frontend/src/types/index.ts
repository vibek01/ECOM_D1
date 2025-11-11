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
  imageUrl: string; // <-- ADDED
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  // imageUrl: string; // <-- This is now gone from the backend response
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // Composite ID: `${productId}-${variantId}`
  productId: string;
  name: string;
  price: number;
  imageUrl: string; // This will now be the specific variant's image URL
  size: string;
  color: string;
  quantity: number;
  stock: number;
}