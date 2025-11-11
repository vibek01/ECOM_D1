import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Frown } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { fetchProducts } from '../store/ProductSlice';
import type { AppDispatch, RootState } from '../store/store';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Button } from '../components/common/Button';
import { ProductToolbar } from '../components/ui/ProductToolbar';
import { FilterPanel } from '../components/ui/FilterPanel';
import { ProductListItem } from '../components/ui/ProductListItem';
import type { ProductFilters } from '../api/ProductApi';

const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square w-full rounded-xl bg-gray-200"></div>
    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="mt-2 h-6 w-1/2 rounded bg-gray-200"></div>
  </div>
);

type ViewMode = 'grid' | 'list';
type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

export const ProductListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((s: RootState) => s.products);
  
  // State for UI components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');

  // --- MODIFIED: Centralized filter state ---
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    sort: 'relevance',
    brand: '',
    color: '',
  });
  const [debouncedSearch] = useDebounce(filters.search, 300);

  // --- MODIFIED: Fetching logic is now in useEffect ---
  useEffect(() => {
    // We create a separate object for the API call to include the debounced search term
    const apiFilters = {
      ...filters,
      search: debouncedSearch,
    };
    dispatch(fetchProducts(apiFilters));
  }, [dispatch, debouncedSearch, filters.sort, filters.brand, filters.color]);

  // Handlers for UI components
  const handleOpenModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleSortChange = (sort: SortKey) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  const handleApplyFilters = useCallback((appliedFilters: { brand?: string[], color?: string[] }) => {
    setFilters(prev => ({
      ...prev,
      brand: appliedFilters.brand?.join(','),
      color: appliedFilters.color?.join(','),
    }));
  }, []);

  // --- MODIFIED: Dynamically get available filter options from all products (fetched once) ---
  const { availableBrands, availableColors } = useMemo(() => {
    const brands = new Set<string>();
    const colors = new Set<string>();
    products.forEach(p => {
      brands.add(p.brand);
      p.variants.forEach(v => colors.add(v.color));
    });
    return {
      availableBrands: Array.from(brands).sort(),
      availableColors: Array.from(colors).sort(),
    };
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderContent = () => {
    if (status === 'loading') {
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
          <Button onClick={() => dispatch(fetchProducts(filters))} className="mt-6 bg-teal-600 hover:bg-teal-700">Retry</Button>
        </div>
      );
    }
    if (products.length === 0) {
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
        {products.map((p: any) => (
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
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        availableBrands={availableBrands}
        availableColors={availableColors}
        activeFilters={{
          brand: filters.brand?.split(',').filter(Boolean) || [],
          color: filters.color?.split(',').filter(Boolean) || [],
        }}
        onApplyFilters={handleApplyFilters}
      />

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
              query={filters.search || ''}
              onQueryChange={handleSearchChange}
              view={view}
              onViewChange={setView}
              sort={filters.sort as SortKey}
              onSortChange={handleSortChange}
              onFilterClick={() => setIsFilterOpen(true)}
            />

            <div className="mt-10">
              <LayoutGroup>
                <AnimatePresence mode="wait">
                  <motion.div key={status === 'loading' ? 'loading' : 'content'}>
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </LayoutGroup>
            </div>
          </div>
        </AppContainer>
      </div>
    </>
  );
};