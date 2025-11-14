import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchMyOrders } from '../../store/orderSlice';
import { Spinner } from '../common/Spinner';
import { DashboardCard } from './DashboardCard';
import { OrderCard } from './OrderCard';

export const OrderHistoryView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMyOrders());
    }
  }, [status, dispatch]);

  const renderContent = () => {
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
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <DashboardCard title="Order History" icon={ShoppingBag}>
      {renderContent()}
    </DashboardCard>
  );
};