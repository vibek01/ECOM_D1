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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background shape
      gsap.fromTo(
        '.hero-bg-shape',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }
      );

      // Staggered text and button animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.fromTo(
        '.hero-badge',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.3 }
      )
        .fromTo(
          '.hero-title > span', // Target spans within the title
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1 }, // Stagger animation for each word
          '-=0.6'
        )
        .fromTo(
          '.hero-subtitle',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1 },
          '-=0.6'
        )
        .fromTo(
          '.hero-buttons',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1 },
          '-=0.6'
        );

      // Animate image with a subtle float and rotation
      gsap.fromTo(
        '.hero-image',
        { scale: 0.9, opacity: 0, rotate: -20, y: 50 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.6,
        }
      );
    }, containerRef);
    return () => ctx.revert(); // Cleanup GSAP animations
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50" ref={containerRef}>
      <AppContainer className="relative z-10 py-28 sm:py-32 md:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* --- Left Column: Text Content --- */}
          <div className="text-center lg:text-left">
            <p className="hero-badge text-sm font-bold uppercase tracking-widest text-emerald-600">
              Find Your Edge
            </p>
            <h1 className="hero-title mt-4 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl md:text-6xl">
              {/* Wrap words in spans for stagger animation */}
              <span>Step</span> <span>Into</span> <span>Your</span> <span className="text-emerald-600">Next</span> <span>Pair</span>
            </h1>
            <p className="hero-subtitle mx-auto mt-6 max-w-lg text-lg text-slate-600 lg:mx-0">
              Discover the latest arrivals from the world's top brands. Unmatched style, comfort, and performance await.
            </p>
            <div className="hero-buttons mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" className="group w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto">
                  Shop The Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                  New Arrivals <ShoppingBag className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                </Button>
              </Link>
            </div>
          </div>

          {/* --- Right Column: Image --- */}
          <div className="flex items-center justify-center lg:pl-12">
            <img
              src={heroImage}
              alt="Featured Sneaker"
              className="hero-image w-full max-w-md drop-shadow-2xl md:max-w-lg"
            />
          </div>
        </div>
      </AppContainer>

      {/* --- Decorative Background Shape --- */}
      <div
        aria-hidden="true"
        className="hero-bg-shape absolute -left-1/4 top-0 z-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-tr from-emerald-500/5 to-transparent blur-3xl"
      />
    </section>
  );
};