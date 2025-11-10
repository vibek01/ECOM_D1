import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (productId: string) => void;
}

export const ProductCard = ({ product, onQuickAdd }: ProductCardProps) => {
  // This event handler is now simplified as it's on a button outside the link
  const handleQuickAddClick = (e: React.MouseEvent) => {
    // Stop the event from bubbling up, just in case.
    e.stopPropagation(); 
    e.preventDefault();
    onQuickAdd(product.id);
  };

  return (
    <div className="group relative">
      {/* The Quick Add button is now a sibling to the Link, not a child. */}
      {/* This ensures its click event is independent. */}
      <motion.div
        className="absolute right-4 top-4 z-20 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={handleQuickAddClick}
          aria-label="Quick Add"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </motion.div>
      
      {/* The Link now correctly wraps only the elements that should navigate */}
      <Link to={`/product/${product.id}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow group-hover:shadow-xl"
        >
          <div className="aspect-square w-full bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain object-center p-4 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Text Content is now also inside the link */}
        <div className="mt-4 text-left">
          <h3 className="text-sm font-medium text-gray-800">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};