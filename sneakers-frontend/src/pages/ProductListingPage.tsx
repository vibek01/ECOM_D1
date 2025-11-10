// ProductListingPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Frown,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
} from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { fetchProducts } from '../store/ProductSlice';
import type { AppDispatch, RootState } from '../store/store';
import { QuickAddModal } from '../components/ui/QuickAddModal';
import { Button } from '../components/common/Button';

// ---------------- UI helpers ----------------
const ProductCardSkeleton = () => (
  <div className="animate-pulse space-y-3 rounded-2xl">
    <div className="aspect-square w-full rounded-2xl bg-gray-200"></div>
    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
    <div className="h-6 w-1/4 rounded bg-gray-200"></div>
  </div>
);

type ViewMode = 'grid' | 'list';
type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';

// safe getters so unknown backend shapes don’t crash UI
const getName = (p: any) => p?.name ?? p?.title ?? p?.model ?? 'Product';
const getPrice = (p: any) =>
  typeof p?.price === 'number'
    ? p.price
    : typeof p?.price === 'string'
    ? parseFloat(p.price) || 0
    : 0;

// ---------------- Main ----------------
export const ProductListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector((s: RootState) => s.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortKey>('relevance');

  useEffect(() => {
    if (status === 'idle' || status === 'failed') {
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

  // ---------- derive filtered/sorted data ----------
  const visibleProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const q = query.trim().toLowerCase();
    let list = products.filter((p: any) => {
      if (!q) return true;
      const name = getName(p).toLowerCase();
      const brand = (p?.brand ?? '').toLowerCase();
      const category = (p?.category ?? '').toLowerCase();
      return name.includes(q) || brand.includes(q) || category.includes(q);
    });

    switch (sort) {
      case 'priceAsc':
        list = [...list].sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'priceDesc':
        list = [...list].sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'nameAsc':
        list = [...list].sort((a, b) => getName(a).localeCompare(getName(b)));
        break;
      case 'nameDesc':
        list = [...list].sort((a, b) => getName(b).localeCompare(getName(a)));
        break;
      default:
        // relevance = keep original order from backend
        break;
    }
    return list;
  }, [products, query, sort]);

  // ---------------- content blocks ----------------
  const LoadingBlock = (
    <div
      className={
        view === 'grid'
          ? 'mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'mt-10 grid grid-cols-1 gap-6'
      }
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );

  const ErrorBlock = (
    <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <Frown className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-3 text-xl font-semibold text-gray-900">Something went wrong</h3>
      <p className="mt-2 text-gray-600">
        {error || 'We couldn’t load the products. Please try again.'}
      </p>
      <Button onClick={() => dispatch(fetchProducts())} className="mt-6">
        Retry
      </Button>
    </div>
  );

  const EmptyBlock = (
    <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <Frown className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-3 text-xl font-semibold text-gray-900">No matches</h3>
      <p className="mt-2 text-gray-600">Try a different search or reset filters.</p>
      {query && (
        <Button variant="outline" className="mt-6" onClick={() => setQuery('')}>
          Clear search
        </Button>
      )}
    </div>
  );

  const ProductsBlock = (
    <div
      className={
        view === 'grid'
          ? 'mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'mt-10 grid grid-cols-1 gap-4'
      }
    >
      {visibleProducts.map((p: any) =>
        view === 'grid' ? (
          <ProductCard key={p.id} product={p} onQuickAdd={handleOpenModal} />
        ) : (
          // Minimal list row (keeps it simple + neutral)
          <div
            key={p.id}
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-gray-900">{getName(p)}</p>
              <p className="mt-1 text-sm text-gray-500">₹{getPrice(p).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleOpenModal(p.id)}>
                Quick add
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );

  // ---------------- render ----------------
  const showLoading = status === 'loading' || status === 'idle';
  const showError = status === 'failed';
  const showEmpty = !showLoading && !showError && visibleProducts.length === 0;

  return (
    <>
      <QuickAddModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <div className="min-h-screen bg-gray-50">
        <AppContainer>
          <div className="py-16 sm:py-20">
            {/* ---------- HEADER ---------- */}
            <div className="text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Minimal Storefront
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
                Clean, calm, and focused. Browse products without distractions.
              </p>
            </div>

            {/* ---------- TOOLBAR ---------- */}
            <div className="mt-10 grid items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
              {/* Search */}
              <div className="col-span-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                {query && (
                  <button
                    aria-label="Clear search"
                    className="rounded p-1 text-gray-500 hover:bg-gray-200"
                    onClick={() => setQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Right controls */}
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="hidden items-center gap-2 sm:flex">
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                {/* View toggle */}
                <div className="flex rounded-lg border border-gray-200">
                  <button
                    onClick={() => setView('grid')}
                    className={`flex items-center gap-1 rounded-l-lg px-3 py-2 text-sm ${
                      view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`flex items-center gap-1 rounded-r-lg px-3 py-2 text-sm ${
                      view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-50"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A → Z</option>
                  <option value="nameDesc">Name: Z → A</option>
                </select>
              </div>
            </div>

            {/* ---------- CONTENT ---------- */}
            {showLoading && LoadingBlock}
            {showError && ErrorBlock}
            {showEmpty && EmptyBlock}
            {!showLoading && !showError && !showEmpty && ProductsBlock}
          </div>
        </AppContainer>
      </div>
    </>
  );
};
