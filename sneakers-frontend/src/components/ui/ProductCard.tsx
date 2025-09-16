import type { Product } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
            {/* You can add more details here, like brand or color */}
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
};