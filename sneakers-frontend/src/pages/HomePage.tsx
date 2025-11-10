import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { NewsletterSignup } from '../components/sections/NewsletterSignup';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts title="Featured Collection" />
      <NewsletterSignup />
    </>
  );
};