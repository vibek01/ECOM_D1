import { useEffect, useState } from 'react';
import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { apiPublic } from '../api/axios'; // <-- Import the public API instance
import type { Product } from '../types';
import { Spinner } from '../components/common/Spinner';

export const ProductListingPage = () => {
  // State to hold products, loading status, and any potential errors
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch data from the backend instead of the static file
        const response = await apiPublic.get('/products');
        setProducts(response.data.data);
      } catch (err) {
        setError('Failed to load sneakers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on component mount

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }

    if (products.length === 0) {
      return <p className="text-center text-slate-500">No sneakers found.</p>;
    }

    return (
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
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
  );
};