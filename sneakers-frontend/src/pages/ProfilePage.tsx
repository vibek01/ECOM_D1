import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, ShoppingBag } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import type { RootState, AppDispatch } from '../store/store';
import { ProfileSidebar } from '../components/ui/ProfileSidebar';
import { DashboardCard } from '../components/ui/DashboardCard';
import { fetchMyOrders } from '../store/orderSlice';
import { Spinner } from '../components/common/Spinner';

const OrderHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    // To avoid fetching every time the component re-renders, you might add a condition
    if (status === 'idle') {
      dispatch(fetchMyOrders());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  if (status === 'failed') {
    return <p className="text-center text-red-500 py-12">Failed to load order history.</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-slate-500 py-12">
        <p className="font-medium">You have no recent orders.</p>
        <p className="text-sm mt-1">When you place an order, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="p-4 rounded-lg border bg-slate-50/50 text-sm transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-center justify-between font-medium text-slate-900">
            <p>Order ID: <span className="font-mono text-slate-700">{order.id.substring(0, 8)}...</span></p>
            <p className="text-lg">${order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between text-slate-600 mt-2">
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Status: <span className="font-semibold px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800">{order.status}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <AppContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16 sm:py-24"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">
              My Account
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Welcome back, {user?.username}! Manage your profile and orders here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            <div className="lg:col-span-3 space-y-8">
              <DashboardCard
                title="Profile Information"
                icon={User}
                actionButton={{ text: "Edit Profile", onClick: () => {} }}
              >
                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Username</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900">{user?.username}</dd>
                  </div>
                  <div className="border-t border-slate-200/80 pt-6">
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Email Address</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900">{user?.email}</dd>
                  </div>
                  <div className="border-t border-slate-200/80 pt-6">
                    <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Role</dt>
                    <dd className="mt-1 text-base font-medium text-slate-900 capitalize">{user?.role.toLowerCase()}</dd>
                  </div>
                </dl>
              </DashboardCard>
              
              <DashboardCard title="Order History" icon={ShoppingBag}>
                <OrderHistory />
              </DashboardCard>
            </div>
          </div>
        </motion.div>
      </AppContainer>
    </div>
  );
};