import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { Button } from '../common/Button';

interface ProductListItemProps {
  product: Product;
  onQuickAdd: (productId: string) => void;
}

export const ProductListItem = ({ product, onQuickAdd }: ProductListItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="group flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-slate-200/80 bg-white transition-shadow hover:shadow-lg"
    >
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-4" />
        </div>
      </Link>

      <div className="flex-1 text-center sm:text-left">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.brand}</p>
        </Link>
        <p className="mt-2 text-xl font-semibold text-slate-900">${product.price.toFixed(2)}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Button variant="secondary" onClick={() => onQuickAdd(product.id)}>Quick Add</Button>
        <Link to={`/product/${product.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
      </div>
    </motion.div>
  );
};