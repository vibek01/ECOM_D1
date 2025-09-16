import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts title="New Arrivals" />
    </>
  );
};