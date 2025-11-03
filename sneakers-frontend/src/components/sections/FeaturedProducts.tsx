import { products as allProducts } from '../../data/products'; // <-- Import real product data
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';

// Use the first 4 products from the main data source for the feature section
const featuredProducts = allProducts.slice(0, 4);

interface FeaturedProductsProps {
  title: string;
}

export const FeaturedProducts = ({ title }: FeaturedProductsProps) => {
  return (
    <section className="py-16 sm:py-24">
      <AppContainer>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AppContainer>
    </section>
  );
};