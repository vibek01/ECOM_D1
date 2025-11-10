import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppContainer } from '../components/layout/AppContainer';
import { CartItem } from '../components/ui/CartItem';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';
import type { RootState } from '../store/store';
import { OrderSummary } from '../components/ui/OrderSummary';

export const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    // A slightly off-white background makes the white cards stand out
    <div className="min-h-screen bg-slate-50">
      <AppContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 sm:py-24"
        >
          <div className="text-left mb-12">
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
              Your Cart
            </h1>
          </div>

          <AnimatePresence>
            {cartItems.length > 0 ? (
              <motion.div
                key="cart-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12"
              >
                <motion.section
                  aria-labelledby="cart-heading"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-8 space-y-6" // Use space-y for consistent spacing
                >
                  <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.section>

                <OrderSummary />
              </motion.div>
            ) : (
              <motion.div
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center"
              >
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-base text-gray-500">
                  Looks like you haven't added anything yet. Let's find your perfect pair.
                </p>
                <div className="mt-8">
                  <Link to={ROUTES.PRODUCTS}>
                    <Button size="lg" className="group bg-teal-600 hover:bg-teal-700">
                      Continue Shopping
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AppContainer>
    </div>
  );
};