import { useEffect, useState } from 'react'; // <-- Added useState
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppContainer } from '../components/layout/AppContainer';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { VariantSelector } from '../components/ui/VariantSelector';
import { fetchProductById } from '../store/ProductSlice';
import { useProductVariantSelection } from '../hooks/useProductVariantSelection';
import type { AppDispatch, RootState } from '../store/store';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct: product, status, error } = useSelector((state: RootState) => state.products);

  // --- ADDED: State to hold the currently displayed image URL ---
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const {
    selectedSize,
    selectedColor,
    selectedVariant, // <-- We'll use this
    cartItem,
    isAddToCartDisabled,
    handleSizeSelect,
    handleColorSelect,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
  } = useProductVariantSelection(product);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // --- ADDED: Effect to update the display image when the selected variant changes ---
  useEffect(() => {
    if (selectedVariant) {
      setDisplayImage(selectedVariant.imageUrl);
    } else if (product && product.variants.length > 0) {
      setDisplayImage(product.variants[0].imageUrl);
    }
  }, [selectedVariant, product]);

  if (status === 'loading' || !product) {
    return <div className="flex h-[70vh] items-center justify-center"><Spinner size="lg" /></div>;
  }
  if (status === 'failed') {
    return <AppContainer><div className="py-24 text-center"><h1 className="text-2xl font-bold text-red-600">{error || 'Product not found'}</h1></div></AppContainer>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppContainer>
        <div className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center p-8 bg-white rounded-2xl shadow-xl shadow-slate-900/10"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={displayImage} // <-- Key change triggers animation
                  src={displayImage || ''} // <-- MODIFIED
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[500px] w-full object-contain"
                />
              </AnimatePresence>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <p className="font-semibold uppercase tracking-widest text-teal-600">{product.brand}</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">{product.name}</h1>
              <div className="mt-4">
                <p className="text-4xl font-medium text-slate-900">${product.price.toFixed(2)}</p>
              </div>
              <div className="mt-6">
                <p className="text-base text-slate-600 leading-relaxed">{product.description}</p>
              </div>
              <div className="mt-8 space-y-6">
                <VariantSelector
                  variants={product.variants}
                  type="color"
                  selectedValue={selectedColor}
                  onValueSelect={handleColorSelect}
                />
                <VariantSelector
                  variants={product.variants}
                  type="size"
                  selectedValue={selectedSize}
                  onValueSelect={handleSizeSelect}
                />
              </div>
              <div className="mt-10">
                <AnimatePresence mode="wait">
                  {cartItem ? (
                    <motion.div
                      key="quantityControl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex h-14 w-full items-center justify-between rounded-xl border border-slate-300 px-4"
                    >
                      <span className="font-semibold text-slate-800">In Your Cart</span>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={handleDecrement}><Minus className="h-5 w-5" /></Button>
                        <span className="w-10 text-center font-medium text-lg">{cartItem.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={cartItem.quantity >= cartItem.stock}><Plus className="h-5 w-5" /></Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="addToCartButton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-lg bg-teal-600 hover:bg-teal-700" disabled={isAddToCartDisabled}>
                        {isAddToCartDisabled ? 'Unavailable' : 'Add to Cart'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </AppContainer>
    </div>
  );
};