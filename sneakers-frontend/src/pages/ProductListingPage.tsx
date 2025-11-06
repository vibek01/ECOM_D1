import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { fetchProducts } from '../store/ProductSlice';
import type { AppDispatch, RootState } from '../store/store';
import { Spinner } from '../components/common/Spinner';
import { QuickAddModal } from '../components/ui/QuickAddModal';

export const ProductListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((state: RootState) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') { // Fetch only if we haven't fetched before
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

  const renderContent = () => {
    if (status === 'loading') {
      return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>;
    }
    if (status === 'failed') {
      return <p className="text-center text-red-600">{error}</p>;
    }
    if (products.length === 0) {
      return <p className="text-center text-slate-500">No sneakers found.</p>;
    }
    return (
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickAdd={handleOpenModal} /> // REVERTED: back to '.id'
        ))}
      </div>
    );
  };

  return (
    <>
      <QuickAddModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <div className="bg-white">
        <AppContainer>
          <div className="py-16 sm:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">All Sneakers</h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Browse our curated collection of the best sneakers from top brands around the world.
            </p>
            {renderContent()}
          </div>
        </AppContainer>
      </div>
    </>
  );
};