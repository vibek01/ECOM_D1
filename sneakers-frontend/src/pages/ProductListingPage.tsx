import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Frown } from 'lucide-react';

import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { fetchProducts } from '../store/ProductSlice';
import type { AppDispatch, RootState } from '../store/store';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Button } from '../components/common/Button';
import { ProductToolbar } from '../components/ui/ProductToolbar';
import { FilterPanel } from '../components/ui/FilterPanel';
import { ProductListItem } from '../components/ui/ProductListItem';

// A simple animated skeleton for loading states
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square w-full rounded-xl bg-gray-200"></div>
    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="mt-2 h-6 w-1/2 rounded bg-gray-200"></div>
  </div>
);

type ViewMode = 'grid' | 'list';
type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

const getName = (p: any) => p?.name ?? 'Product';
const getPrice = (p: any) => (typeof p?.price === 'number' ? p.price : 0);

export const ProductListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((s: RootState) => s.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortKey>('relevance');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleOpenModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const visibleProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let list = products.filter((p: any) => getName(p).toLowerCase().includes(query.toLowerCase()));
    switch (sort) {
      case 'priceAsc': return [...list].sort((a, b) => getPrice(a) - getPrice(b));
      case 'priceDesc': return [...list].sort((a, b) => getPrice(b) - getPrice(a));
      case 'nameAsc': return [...list].sort((a, b) => getName(a).localeCompare(getName(b)));
      case 'nameDesc': return [...list].sort((a, b) => getName(b).localeCompare(getName(a)));
      default: return list;
    }
  }, [products, query, sort]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      );
    }
    if (status === 'failed') {
      return (
        <div className="text-center py-20">
          <Frown className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-3 text-xl font-semibold text-gray-900">Something went wrong</h3>
          <p className="mt-2 text-gray-600">{error || 'We couldn’t load the products.'}</p>
          <Button onClick={() => dispatch(fetchProducts())} className="mt-6 bg-teal-600 hover:bg-teal-700">Retry</Button>
        </div>
      );
    }
    if (visibleProducts.length === 0) {
      return (
        <div className="text-center py-20">
          <Frown className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-3 text-xl font-semibold text-gray-900">No Matches Found</h3>
          <p className="mt-2 text-gray-600">Try adjusting your search or filters.</p>
        </div>
      );
    }
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={view === 'grid'
          ? "grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          : "space-y-4"
        }
      >
        {visibleProducts.map((p: any) => (
          <motion.div key={p.id} variants={itemVariants} layout="position">
            {view === 'grid' ? (
              <ProductCard product={p} onQuickAdd={handleOpenModal} />
            ) : (
              <ProductListItem product={p} onQuickAdd={handleOpenModal} />
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <>
      <QuickAddModal productId={selectedProductId} isOpen={isModalOpen} onClose={handleCloseModal} />
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      <div className="min-h-screen bg-slate-50">
        <AppContainer>
          <div className="py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
                The <span className="text-teal-600">Collection</span>
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
                Curated for style, engineered for performance. Find your next favorite pair.
              </p>
            </div>

            <ProductToolbar
              query={query}
              onQueryChange={setQuery}
              view={view}
              onViewChange={setView}
              sort={sort}
              onSortChange={setSort}
              onFilterClick={() => setIsFilterOpen(true)}
            />

            <div className="mt-10">
              <LayoutGroup>
                {renderContent()}
              </LayoutGroup>
            </div>
          </div>
        </AppContainer>
      </div>
    </>
  );
};