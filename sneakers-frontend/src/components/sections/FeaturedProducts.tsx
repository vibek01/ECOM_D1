import { useEffect, useState } from 'react';
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';
import { apiPublic } from '../../api/axios'; // <-- Import the public API instance
import type { Product } from '../../types';

interface FeaturedProductsProps {
  title: string;
}

export const FeaturedProducts = ({ title }: FeaturedProductsProps) => {
  // State to hold products, loading status, and any potential errors
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await apiPublic.get('/products');
        // Take the first 4 products as "featured"
        const featured = response.data.data.slice(0, 4);
        setProducts(featured);
      } catch (err) {
        // In case of an error, we can just show an empty section
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // If loading or there are no products, we can choose to render nothing
  // to avoid empty space or spinners on the homepage.
  if (loading || products.length === 0) {
    // You could return a skeleton loader here for a better UX
    return null;
  }

  return (
    <section className="py-16 sm:py-24">
      <AppContainer>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AppContainer>
    </section>
  );
};