import type { Product } from '../../types'; // We will define this type later
import { AppContainer } from '../layout/AppContainer';
import { ProductCard } from '../ui/ProductCard';

// Dummy data for now - this will come from an API call
const dummyProducts: Product[] = [
  { id: '1', name: 'Air Runner Pro', price: 120.00, imageUrl: 'https://via.placeholder.com/400x400?text=Sneaker+1', variants: [] },
  { id: '2', name: 'Urban Stride', price: 89.99, imageUrl: 'https://via.placeholder.com/400x400?text=Sneaker+2', variants: [] },
  { id: '3', name: 'Cloud Comfort', price: 150.50, imageUrl: 'https://via.placeholder.com/400x400?text=Sneaker+3', variants: [] },
  { id: '4', name: 'Retro Flex', price: 99.00, imageUrl: 'https://via.placeholder.com/400x400?text=Sneaker+4', variants: [] },
];

interface FeaturedProductsProps {
  title: string;
  products?: Product[];
}

export const FeaturedProducts = ({ title, products = dummyProducts }: FeaturedProductsProps) => {
  return (
    <section className="py-16 sm:py-24">
      <AppContainer>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AppContainer>
    </section>
  );
};