import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';
import { fetchProducts } from '../../store/ProductSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { QuickAddModal } from '../ui/QuickAddModal'; // <-- Import the modal

interface FeaturedProductsProps {
  title: string;
}

export const FeaturedProducts = ({ title }: FeaturedProductsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((state: RootState) => state.products);

  // --- FIX: Add state management for the Quick Add Modal ---
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

  const featuredProducts = products.slice(0, 4);

  if (status === 'loading' && featuredProducts.length === 0) {
    return null; // Or a loading skeleton
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Render the modal, it will be invisible until opened */}
      <QuickAddModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <section className="py-16 sm:py-24">
        <AppContainer>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              // --- FIX: Pass the onQuickAdd prop to each ProductCard ---
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