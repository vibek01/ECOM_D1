import { AppContainer } from '../components/layout/AppContainer';
import { ProductCard } from '../components/ui/ProductCard';
import { products } from '../data/products'; // <-- Import from the new data file

export const ProductListingPage = () => {
  return (
    <div className="bg-white">
      <AppContainer>
        <div className="py-16 sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">All Sneakers</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Browse our curated collection of the best sneakers from top brands around the world.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </AppContainer>
    </div>
  );
};