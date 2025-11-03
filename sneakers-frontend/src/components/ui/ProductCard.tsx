import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus } from 'lucide-react';
import type { Product } from '../../types';
import type { RootState } from '../../store/store';
import { addItem, incrementQuantity, decrementQuantity } from '../../store/cartSlice';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.productId === product.id)
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent redirection
    const defaultVariant = product.variants.find((v) => v.stock > 0);
    if (defaultVariant) {
      dispatch(
        addItem({
          id: defaultVariant.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          size: defaultVariant.size,
          color: defaultVariant.color,
          quantity: 1,
          stock: defaultVariant.stock,
        })
      );
    } else {
      alert('This product is currently out of stock.');
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent redirection
    if (cartItem) {
      dispatch(incrementQuantity(cartItem.id));
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent redirection
    if (cartItem) {
      dispatch(decrementQuantity(cartItem.id));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">{product.name}</h3>
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="mt-4 flex-1 flex items-end">
        <AnimatePresence mode="wait">
          {cartItem ? (
            <motion.div
              key="quantity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex w-full items-center justify-between rounded-md border border-slate-300"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{cartItem.quantity} in cart</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                className="w-full"
              >
                Add to Cart
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};