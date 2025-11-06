// Represents a single variant of a product.
export interface ProductVariant {
  id: string; // REVERTED: back to 'id'
  size: string;
  color: string;
  stock: number;
}

// Represents the main product.
export interface Product {
  id: string; // REVERTED: back to 'id'
  name: string;
  brand?: string;
  description?: string;
  price: number;
  imageUrl: string;
  variants: ProductVariant[];
}

// Represents an item in the shopping cart.
export interface CartItem {
  id: string; // This is the composite key, e.g., "productId-variantId"
  productId: string; // This will be the product's id
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

// Represents the authenticated user.
export interface User {
  _id: string; // User model might still use _id if not transformed, adjust if needed
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}