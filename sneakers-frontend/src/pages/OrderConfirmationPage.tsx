import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppContainer } from '../components/layout/AppContainer';
import { Button } from '../components/common/Button';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <AppContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Thank You for Your Order!
          </h1>
          <p className="mt-4 text-slate-600">
            Your order has been placed successfully. A confirmation email has been sent to you.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Order ID: <span className="font-medium text-slate-800">{orderId}</span>
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/profile">
              <Button variant="outline">View My Orders</Button>
            </Link>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </AppContainer>
    </div>
  );
};