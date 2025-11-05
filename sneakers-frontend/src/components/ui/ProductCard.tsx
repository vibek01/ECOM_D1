import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (productId: string) => void; // Callback to open the modal
}

export const ProductCard = ({ product, onQuickAdd }: ProductCardProps) => {
  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop the event from bubbling up
    onQuickAdd(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="flex-grow">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="mt-4">
        <Button
          variant="secondary"
          className="w-full relative z-10"
          onClick={handleQuickAddClick}
        >
          Quick Add
        </Button>
      </div>
    </motion.div>
  );
};