import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { AppContainer } from '../layout/AppContainer';
import { Button } from '../common/Button';
// Make sure to add an image at this path
import heroImage from '../../assets/images/hero-sneaker.png';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animation: Animate elements on component mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.hero-subtitle',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo(
        '.hero-button',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.hero-image',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );
    }, containerRef);
    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <section className="overflow-hidden bg-slate-50" ref={containerRef}>
      <AppContainer className="relative py-20 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="hero-title text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Find Your Perfect Pair
            </h1>
            <p className="hero-subtitle mt-6 text-lg text-slate-600">
              Discover the latest trends in sneakers. Unmatched style, comfort, and performance for
              your feet.
            </p>
            <div className="hero-button mt-8 flex justify-center gap-4 md:justify-start">
              <Button size="lg">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="hero-image flex items-center justify-center">
            <img
              src={heroImage}
              alt="Featured Sneaker"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </AppContainer>
    </section>
  );
};