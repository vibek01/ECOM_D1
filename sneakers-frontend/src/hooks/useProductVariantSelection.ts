import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { Product, ProductVariant, CartItem as CartItemType } from '../types';
import type { RootState, AppDispatch } from '../store/store';
import { addItem, incrementQuantity, decrementQuantity } from '../store/cartSlice';

export const useProductVariantSelection = (product: Product | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
      setSelectedSize(defaultVariant.size);
      setSelectedColor(defaultVariant.color);
    } else {
      setSelectedSize(null);
      setSelectedColor(null);
    }
  }, [product]);

  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product || !selectedSize || !selectedColor) {
      return null;
    }
    return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
  }, [product, selectedSize, selectedColor]);

  const compositeId = useMemo<string | null>(() => {
    if (product && selectedVariant) {
      return `${product.id}-${selectedVariant.id}`;
    }
    return null;
  }, [product, selectedVariant]);

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartItem = useMemo(() => {
    return cartItems.find(item => item.id === compositeId);
  }, [cartItems, compositeId]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    if (product && selectedVariant && compositeId) {
      const itemToAdd: CartItemType = {
        id: compositeId,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: selectedVariant.imageUrl, // <-- MODIFIED: Use the variant's specific image
        size: selectedVariant.size,
        color: selectedVariant.color,
        quantity: 1,
        stock: selectedVariant.stock,
      };
      dispatch(addItem(itemToAdd));
    }
  };

  const handleIncrement = () => cartItem && dispatch(incrementQuantity(cartItem.id));
  const handleDecrement = () => cartItem && dispatch(decrementQuantity(cartItem.id));

  const isAddToCartDisabled = !selectedVariant || selectedVariant.stock === 0;

  return {
    selectedSize,
    selectedColor,
    selectedVariant,
    cartItem,
    isAddToCartDisabled,
    handleSizeSelect,
    handleColorSelect,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
  };
};