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
    return <div className="flex h-[70vh] items-center justify-center"><Spinner size="lg" /></div>;
  }
  if (status === 'failed') {
    return <AppContainer><div className="py-24 text-center"><h1 className="text-2xl font-bold text-red-600">{error || 'Product not found'}</h1></div></AppContainer>;
  }

  // Animation variants for staggering child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppContainer>
        <div className="py-16 sm:py-24">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Left Column: Product Image */}
            <motion.div variants={itemVariants} className="flex items-center justify-center p-8 bg-white rounded-2xl shadow-xl shadow-slate-900/10">
              <motion.img
                key={product.imageUrl}
                src={product.imageUrl}
                alt={product.name}
                className="max-h-[500px] w-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Right Column: Product Details */}
            <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <motion.p variants={itemVariants} className="font-semibold uppercase tracking-widest text-teal-600">{product.brand}</motion.p>
              
              <motion.h1 variants={itemVariants} className="mt-2 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">{product.name}</motion.h1>
              
              <motion.div variants={itemVariants} className="mt-4">
                <p className="text-4xl font-medium text-slate-900">${product.price.toFixed(2)}</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-6">
                <p className="text-base text-slate-600 leading-relaxed">{product.description}</p>
              </motion.div>

              <div className="mt-8 space-y-6">
                <motion.div variants={itemVariants}>
                  <VariantSelector
                    variants={product.variants}
                    type="color"
                    selectedValue={selectedColor}
                    onValueSelect={handleColorSelect}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <VariantSelector
                    variants={product.variants}
                    type="size"
                    selectedValue={selectedSize}
                    onValueSelect={handleSizeSelect}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="mt-10">
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AppContainer>
    </div>
  );
};