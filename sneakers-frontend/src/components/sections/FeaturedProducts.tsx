import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';
import { fetchProducts } from '../../store/ProductSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { QuickAddModal } from '../ui/QuickAddModal';

interface FeaturedProductsProps {
  title: string;
}

export const FeaturedProducts = ({ title }: FeaturedProductsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((state: RootState) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleOpenModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  };

  // Display only the first 4 products for the feature section
  const featuredProducts = products.slice(0, 4);

  if (status === 'loading' && featuredProducts.length === 0) {
    return null; // Don't show anything if it's the initial load
  }

  if (featuredProducts.length === 0) {
    return null; // Don't render the section if there are no products
  }

  return (
    <>
      <QuickAddModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <section className="bg-white py-24 sm:py-32">
        <AppContainer>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
            <Link 
              to="/products" 
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={handleOpenModal}
              />
            ))}
          </div>
        </AppContainer>
      </section>
    </>
  );
};