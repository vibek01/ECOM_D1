import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById } from '../../api/ProductApi';
import { addItem, incrementQuantity, decrementQuantity } from '../../store/cartSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { Product, ProductVariant } from '../../types';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { VariantSelector } from './VariantSelector'; // <-- IMPORT THE CORRECT COMPONENT

interface QuickAddModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal = ({ productId, isOpen, onClose }: QuickAddModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setStatus('loading');
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        const defaultVariant = productData.variants.find((v: ProductVariant) => v.stock > 0) || productData.variants[0] || null;
        setSelectedVariant(defaultVariant);
        setStatus('succeeded');
      } catch (err) {
        setStatus('failed');
        setError('Failed to load product details.');
      }
    };
    if (isOpen) {
      fetchProduct();
    } else {
      setProduct(null);
      setSelectedVariant(null);
      setStatus('idle');
    }
  }, [productId, isOpen]);

  const compositeId = product && selectedVariant ? `${product.id}-${selectedVariant.id}` : null;
  const cartItem = useSelector((state: RootState) =>
    compositeId ? state.cart.items.find(item => item.id === compositeId) : undefined
  );

  const handleAddToCart = () => {
    if (product && selectedVariant && compositeId) {
      dispatch(addItem({
        id: compositeId,
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedVariant.size,
        color: selectedVariant.color,
        quantity: 1,
        stock: selectedVariant.stock,
      }));
    }
  };

  const handleIncrement = () => cartItem && dispatch(incrementQuantity(cartItem.id));
  const handleDecrement = () => cartItem && dispatch(decrementQuantity(cartItem.id));

  const renderContent = () => {
    if (status === 'loading' || !product) {
      return <div className="flex h-80 items-center justify-center"><Spinner /></div>;
    }
    if (status === 'failed') {
      return <p className="text-center text-red-500">{error}</p>;
    }

    const isOutOfStock = selectedVariant?.stock === 0;

    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4">
          <img src={product.imageUrl} alt={product.name} className="max-h-80 w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
          
          {/* --- FIX: USE THE VARIANTSELECTOR COMPONENT --- */}
          <div className="mt-4 space-y-4">
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
              type="size"
            />
            {/* You can add another for 'color' here if needed */}
          </div>

          <div className="mt-auto pt-6">
            <AnimatePresence mode="wait">
              {cartItem ? (
                <motion.div key="quantity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300">
                  <span className="px-4 font-semibold">Quantity</span>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={handleDecrement}><Minus className="h-4 w-4" /></Button>
                    <span className="w-10 text-center">{cartItem.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={cartItem.quantity >= cartItem.stock}><Plus className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={!selectedVariant || isOutOfStock}>
                    {!selectedVariant ? 'Select a size' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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