import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import type { RootState } from '../../store/store';

export const OrderSummary = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <motion.section
      aria-labelledby="summary-heading"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-4 mt-16 rounded-2xl bg-white shadow-lg shadow-slate-900/5 p-6 lg:mt-0 lg:sticky lg:top-24"
    >
      <h2 id="summary-heading" className="text-xl font-bold text-slate-900">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-slate-600">Subtotal</dt>
          <dd className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</dd>
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <dt className="text-sm text-slate-600">Shipping estimate</dt>
          <dd className="text-sm font-medium text-slate-900">${shipping.toFixed(2)}</dd>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <dt className="text-base font-bold text-slate-900">Order total</dt>
          <dd className="text-base font-bold text-slate-900">${total.toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/checkout" className="w-full block">
            <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700">
              Proceed to Checkout
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};