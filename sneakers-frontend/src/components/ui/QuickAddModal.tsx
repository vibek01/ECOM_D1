import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductById } from '../../store/ProductSlice';
import { addItem, incrementQuantity, decrementQuantity } from '../../store/cartSlice';
import type { AppDispatch, RootState } from '../../store/store';
import type { ProductVariant } from '../../types';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

interface QuickAddModalProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal = ({ productId, isOpen, onClose }: QuickAddModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct: product, status, error } = useSelector((state: RootState) => state.products);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Fetch product details when the modal is opened with a valid product ID
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  // Set a default variant once the product data is loaded
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Default to the first variant that is in stock
      const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
      setSelectedVariant(defaultVariant);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Find the corresponding item in the cart to show quantity controls if it's already added
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(item => item.id === selectedVariant?.id)
  );

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      dispatch(addItem({
        id: selectedVariant.id,
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

  const handleClose = () => {
    onClose();
  };

  const renderContent = () => {
    if (status === 'loading' || !product) {
      return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
    }
    if (status === 'failed') {
      return <p className="text-center text-red-500">{error || 'Failed to load product details.'}</p>;
    }

    const isOutOfStock = selectedVariant?.stock === 0;

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4">
          <img src={product.imageUrl} alt={product.name} className="max-h-64 w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
            <fieldset className="mt-2">
              <legend className="sr-only">Choose a size</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors
                      ${selectedVariant?.id === variant.id
                        ? 'border-transparent bg-indigo-600 text-white'
                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'}
                      ${variant.stock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="mt-auto pt-6">
            <AnimatePresence mode="wait">
              {cartItem ? (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-12 w-full items-center justify-between rounded-md border border-gray-300"
                >
                  <span className="px-4 font-semibold">Quantity</span>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => dispatch(decrementQuantity(cartItem.id))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-10 text-center">{cartItem.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => dispatch(incrementQuantity(cartItem.id))} disabled={cartItem.quantity >= cartItem.stock}><Plus className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button onClick={handleAddToCart} className="w-full" size="lg" disabled={isOutOfStock}>
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative m-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={handleClose}>
              <X className="h-6 w-6" />
            </Button>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};