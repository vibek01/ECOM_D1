import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';
import { fetchProducts } from '../../store/ProductSlice';
import type { AppDispatch, RootState } from '../../store/store';

interface FeaturedProductsProps {
  title: string;
}

export const FeaturedProducts = ({ title }: FeaturedProductsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // Only fetch products if they haven't been fetched already
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Get the first 4 products for the feature section
  const featuredProducts = products.slice(0, 4);

  if (status === 'loading' && featuredProducts.length === 0) {
    // Optional: render a skeleton loader here
    return null;
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24">
      <AppContainer>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AppContainer>
    </section>
  );
};