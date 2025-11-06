import { useEffect } from 'react';
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

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const {
    selectedSize,
    selectedColor,
    cartItem,
    isAddToCartDisabled,
    handleSizeSelect,
    handleColorSelect,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
  } = useProductVariantSelection(product);

  if (status === 'loading' || !product) {
    return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }
  if (status === 'failed') {
    return <AppContainer><div className="py-24 text-center"><h1 className="text-2xl font-bold text-red-600">{error || 'Product not found'}</h1></div></AppContainer>;
  }

  return (
    <div className="bg-white">
      <AppContainer>
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
              <motion.img key={product.imageUrl} src={product.imageUrl} alt={product.name} className="max-h-[450px] w-full object-contain" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} />
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-slate-500">{product.brand}</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
              <div className="mt-4 flex items-center"><p className="text-3xl text-slate-900">${product.price.toFixed(2)}</p></div>
              <div className="mt-6"><p className="text-base text-slate-700">{product.description}</p></div>
              <div className="mt-8 space-y-6">
                {/* --- CORRECTED --- */}
                <VariantSelector
                  variants={product.variants}
                  type="size"
                  selectedValue={selectedSize}
                  onValueSelect={handleSizeSelect}
                />
                {/* --- CORRECTED --- */}
                <VariantSelector
                  variants={product.variants}
                  type="color"
                  selectedValue={selectedColor}
                  onValueSelect={handleColorSelect}
                />
              </div>
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {cartItem ? (
                    <motion.div key="quantityControl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-12 w-full items-center justify-between rounded-md border border-slate-300 px-3">
                      <span className="font-semibold">In Cart</span>
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={handleDecrement}><Minus className="h-4 w-4" /></Button>
                        <span className="w-10 text-center font-medium">{cartItem.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={cartItem.quantity >= cartItem.stock}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="addToCartButton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Button onClick={handleAddToCart} size="lg" className="w-full" disabled={isAddToCartDisabled}>
                        {isAddToCartDisabled ? 'Unavailable' : 'Add to Cart'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </div>
  );
};