import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, DollarSign, Calendar } from 'lucide-react';
import { getAllOrders } from '../../api/OrderApi';
import type { Order } from '../../types';
import { Spinner } from '../../components/common/Spinner';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';

// A new component for the order summary card
const OrderCard = ({ order, onClick }: { order: Order, onClick: () => void }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm font-semibold text-slate-800">#{order.id.substring(0, 8)}...</p>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
      <div className="text-sm text-slate-500 space-y-2">
        <div className="flex items-center gap-2"><User size={14} /> {(order.user as any)?.username || 'N/A'}</div>
        <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</div>
        <div className="flex items-center gap-2 pt-2 border-t mt-2"><DollarSign size={14} /> <span className="font-semibold text-slate-700">${order.totalAmount.toFixed(2)}</span></div>
      </div>
    </motion.div>
  );
};

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderUpdate = () => {
    // Simply re-fetch the orders to get the latest data
    fetchOrders();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <>
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleOrderUpdate}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <p className="mt-1 text-slate-600">Click on an order card to view details and update its status.</p>
        
        {orders.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-slate-500">No orders have been placed yet.</p>
          </div>
        )}
      </div>
    </>
  );
};