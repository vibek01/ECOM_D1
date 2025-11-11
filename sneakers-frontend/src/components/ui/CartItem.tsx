import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus, Minus, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import type { CartItem as CartItemType } from '../../types';
import { Button } from '../common/Button';
import { incrementQuantity, decrementQuantity, removeItem } from '../../store/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();

  // FIX: The 'itemVariants' constant has been removed to prevent the TypeScript error.
  // Animations will be applied directly to the motion component below.

  return (
    <motion.li
      layout
      // FIX: Applying animation properties directly to the component.
      // This is the robust solution that avoids the 'variants' type issue.
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3, ease: 'easeInOut' } }}
      
      // The hover animations and styling remain the same.
      whileHover={{
        y: -4,
        boxShadow: '0 12px 24px rgba(0,0,0,0.08), 0 8px 12px rgba(0,0,0,0.05)',
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      className="group flex flex-col sm:flex-row p-6 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 
                 border border-slate-100 shadow-md hover:shadow-xl hover:border-slate-200 transition-all duration-300"
    >
      {/* Product Image with depth and reflection */}
      <motion.div
        className="relative flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-2 flex items-center justify-center"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-32 w-32 sm:h-36 sm:w-36 object-contain drop-shadow-md"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* Product Details */}
      <div className="ml-0 mt-4 sm:ml-6 sm:mt-0 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
              <Link
                to={`/product/${item.productId}`}
                className="hover:text-teal-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </h3>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              onClick={() => dispatch(removeItem(item.id))}
            >
              <span className="sr-only">Remove</span>
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                <X className="h-5 w-5" />
              </motion.div>
            </Button>
          </div>

          <div className="mt-1 flex text-sm text-slate-500">
            <p>{item.color}</p>
            <p className="ml-4 border-l border-slate-200 pl-4">Size {item.size}</p>
          </div>

          {/* Animated Price */}
          <motion.p
            key={item.quantity}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-xl font-bold text-slate-900 tracking-tight"
          >
            ${(item.price * item.quantity).toFixed(2)}
          </motion.p>
        </div>

        {/* Quantity and Stock */}
        <div className="mt-5 flex items-center justify-between">
          {/* Quantity Controller */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-inner">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
              onClick={() => dispatch(decrementQuantity(item.id))}
            >
              <Minus className="h-4 w-4" />
            </motion.button>

            <motion.span
              key={item.quantity}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="w-10 text-center text-sm font-semibold text-slate-800"
            >
              {item.quantity}
            </motion.span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors"
              onClick={() => dispatch(incrementQuantity(item.id))}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Stock Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg"
          >
            <CheckCircle className="h-4 w-4 mr-1.5 text-emerald-600" />
            <span>In stock</span>
          </motion.div>
        </div>
      </div>
    </motion.li>
  );
};