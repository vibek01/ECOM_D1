import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { AppContainer } from '../components/layout/AppContainer';
import { Button } from '../components/common/Button';
import { addItem, incrementQuantity, decrementQuantity } from '../store/cartSlice';
import type { RootState } from '../store/store';
import type { ProductVariant } from '../types';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const product = products.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants.find((v) => v.stock > 0) || product?.variants[0] || null
  );

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === selectedVariant?.id)
  );

  if (!product) {
    return (
      <AppContainer>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </AppContainer>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addItem({
          id: selectedVariant.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          size: selectedVariant.size,
          color: selectedVariant.color,
          quantity: 1, // Always add 1 initially
          stock: selectedVariant.stock,
        })
      );
    }
  };

  const isOutOfStock = selectedVariant?.stock === 0;

  return (
    <div className="bg-white">
      <AppContainer>
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
              <motion.img
                key={product.imageUrl}
                src={product.imageUrl}
                alt={product.name}
                className="max-h-[450px] w-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Product Info */}
            <div>
              <p className="font-semibold uppercase tracking-wider text-slate-500">{product.brand}</p>
              <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center">
                <p className="text-3xl text-slate-900">${product.price.toFixed(2)}</p>
                <div className="ml-4 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-slate-500">(12 Reviews)</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <p className="text-base text-slate-700">{product.description}</p>
              </div>

              {/* Variant selectors would go here */}

              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {cartItem ? (
                    <motion.div
                      key="quantityControl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-11 w-full items-center justify-between rounded-md border border-slate-300 px-2"
                    >
                      <span className="font-semibold">Quantity</span>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => dispatch(decrementQuantity(cartItem.id))}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-medium">{cartItem.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => dispatch(incrementQuantity(cartItem.id))}
                          aria-label="Increase quantity"
                          disabled={cartItem.quantity >= cartItem.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="addToCartButton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={handleAddToCart}
                        size="lg"
                        className="w-full"
                        disabled={isOutOfStock}
                      >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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