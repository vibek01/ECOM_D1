import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { AppContainer } from '../layout/AppContainer';
import { Button } from '../common/Button';
import { ROUTES } from '../../constants';
import heroImage from '../../assets/images/hero-sneaker.png';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animation: Animate elements on component mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background shape
      gsap.fromTo(
        '.hero-bg-shape',
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
        }
      );

      // Staggered text and button animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.hero-badge',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3 }
      )
        .fromTo(
          '.hero-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4' // Overlap with previous animation
        )
        .fromTo(
          '.hero-subtitle',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-buttons',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        );

      // Animate image with rotation and scale
      gsap.fromTo(
        '.hero-image',
        { scale: 0.8, opacity: 0, rotate: -15 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }, containerRef);
    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <section className="relative overflow-hidden bg-gray-50" ref={containerRef}>
      <AppContainer className="relative z-10 py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* --- Left Column: Text Content --- */}
          <div className="text-center md:text-left">
            <p className="hero-badge text-sm font-bold uppercase tracking-widest text-blue-600">
              New Arrivals
            </p>
            <h1 className="hero-title mt-4 text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Step Into Your{' '}
              <span className="text-blue-600">Perfect Pair</span>
            </h1>
            <p className="hero-subtitle mx-auto mt-6 max-w-lg text-lg text-gray-600 md:mx-0">
              Discover the latest trends in sneakers. Unmatched style, comfort, and performance for
              your feet.
            </p>
            <div className="hero-buttons mt-10 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="group w-full sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                  Explore Collections <ShoppingBag className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                </Button>
              </Link>
            </div>
          </div>

          {/* --- Right Column: Image --- */}
          <div className="flex items-center justify-center">
            <img
              src={heroImage}
              alt="Featured Sneaker"
              className="hero-image w-full max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </AppContainer>

      {/* --- Decorative Background Shape --- */}
      <div
        aria-hidden="true"
        className="hero-bg-shape absolute -right-1/4 -top-1/4 z-0 h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-3xl"
      />
    </section>
  );
};