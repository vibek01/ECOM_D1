import { useEffect, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getProductById } from '../../api/ProductApi';
import { useProductVariantSelection } from '../../hooks/useProductVariantSelection';
import type { Product } from '../../types';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { VariantSelector } from './VariantSelector';

interface QuickAddModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal = ({ productId, isOpen, onClose }: QuickAddModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  // --- FIX START ---
  // State to hold the currently visible image URL
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const {
    selectedSize,
    selectedColor,
    selectedVariant, // We'll use this to get the correct image
    cartItem,
    isAddToCartDisabled,
    handleSizeSelect,
    handleColorSelect,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
  } = useProductVariantSelection(product);

  // Effect to fetch product data when the modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setStatus('loading');
      setProduct(null);
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        // Set the initial display image to the first variant's image
        if (productData?.variants?.length > 0) {
          setDisplayImage(productData.variants[0].imageUrl);
        }
        setStatus('succeeded');
      } catch (err) {
        setStatus('failed');
        setError('Failed to load product details.');
      }
    };

    if (isOpen) {
      fetchProduct();
    } else {
      // Reset state when modal closes
      setStatus('idle');
      setProduct(null);
      setDisplayImage(null);
    }
  }, [productId, isOpen]);

  // Effect to update the display image when the selected variant changes
  useEffect(() => {
    if (selectedVariant) {
      setDisplayImage(selectedVariant.imageUrl);
    }
  }, [selectedVariant]);
  // --- FIX END ---

  const renderContent = () => {
    if (status === 'loading' || !product) {
      return <div className="flex h-80 items-center justify-center"><Spinner /></div>;
    }
    if (status === 'failed') {
      return <p className="text-center text-red-500">{error}</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4">
          {/* --- MODIFIED: Use AnimatePresence for smooth image transitions --- */}
          <AnimatePresence mode="wait">
            <motion.img
              key={displayImage} // Key change triggers the animation
              src={displayImage || ''}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-80 w-full object-contain"
            />
          </AnimatePresence>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
          <div className="mt-4 space-y-4">
            <VariantSelector
              variants={product.variants}
              type="size"
              selectedValue={selectedSize}
              onValueSelect={handleSizeSelect}
            />
            <VariantSelector
              variants={product.variants}
              type="color"
              selectedValue={selectedColor}
              onValueSelect={handleColorSelect}
            />
          </div>
          <div className="mt-auto pt-6">
            <AnimatePresence mode="wait">
              {cartItem ? (
                <motion.div key="quantity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300">
                  <span className="px-4 font-semibold">In Cart</span>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={handleDecrement}><Minus className="h-4 w-4" /></Button>
                    <span className="w-10 text-center">{cartItem.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={cartItem.quantity >= cartItem.stock}><Plus className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={isAddToCartDisabled}>
                    {isAddToCartDisabled ? 'Unavailable' : 'Add to Cart'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ duration: 0.2 }} className="relative m-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};