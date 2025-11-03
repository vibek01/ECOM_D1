import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, CheckCircle, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { AppContainer } from '../components/layout/AppContainer';
import { Button } from '../components/common/Button';
import { addItem } from '../store/cartSlice';
import type { ProductVariant } from '../types';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const product = products.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants.find((v) => v.stock > 0) || product?.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

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
          quantity: quantity,
          stock: selectedVariant.stock,
        })
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
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

              <div className="mt-8">
                {/* Variant Selector Logic would go here */}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center rounded-md border border-slate-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant?.stock || q, q + 1))
                    }
                    disabled={isOutOfStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  disabled={isOutOfStock}
                >
                  {showSuccess ? (
                    <motion.span
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex items-center"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" /> Added!
                    </motion.span>
                  ) : isOutOfStock ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </div>
  );
};