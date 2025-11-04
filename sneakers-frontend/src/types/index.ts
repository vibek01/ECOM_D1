// Represents a single variant of a product, e.g., a specific size and color combination.
export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number; // How many are available in inventory
}

// Represents the main product. It contains an array of its available variants.
export interface Product {
  id: string;
  name: string;
  brand?: string; // Optional brand name
  description?: string; // Optional full description
  price: number;
  imageUrl: string;
  variants: ProductVariant[];
}

// Represents an item that has been added to the shopping cart.
// It's based on a product but includes the selected variant details and quantity.
export interface CartItem {
  id: string; // A unique ID for the cart item itself (e.g., productId + variantId)
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  quantity: number;
  stock: number; // Available stock for this specific variant
}

// --- ADD THIS NEW TYPE ---
// Represents the authenticated user.
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}