import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, CheckCircle } from 'lucide-react';
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
    product?.variants[0] || null
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

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

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
      setTimeout(() => setShowSuccess(false), 2000); // Hide after 2 seconds
    }
  };

  return (
    <div className="bg-white">
      <AppContainer>
        <div className="py-12">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Image Gallery */}
            <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-[450px] w-full object-contain"
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
                {/* Size Selector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedVariant(product.variants.find((v) => v.size === size) || null)
                        }
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-25 ${
                          selectedVariant?.size === size
                            ? 'border-transparent bg-slate-900 text-white'
                            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedVariant(product.variants.find((v) => v.color === color) || null)
                        }
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-25 ${
                          selectedVariant?.color === color
                            ? 'border-transparent bg-slate-900 text-white'
                            : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  {showSuccess ? (
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" /> Added!
                    </span>
                  ) : selectedVariant?.stock === 0 ? (
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