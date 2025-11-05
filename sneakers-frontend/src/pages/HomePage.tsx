import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';

export const HomePage = () => {
  // The useEffect hook that redirected admins has been removed.
  // The header link is now the primary way for admins to navigate.
  return (
    <>
      <HeroSection />
      <FeaturedProducts title="New Arrivals" />
    </>
  );
};