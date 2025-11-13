import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../api/OrderApi';
import type { Order } from '../../types';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert('Failed to update order status.');
    }
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Order Details: ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="text-sm">
            <p><strong>Customer:</strong> {(selectedOrder.user as any)?.username}</p>
            <p><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4 className="font-bold mt-4">Items:</h4>
            <ul className="list-disc pl-5">
              {selectedOrder.items.map(item => (
                <li key={item.variantId}>{item.name} ({item.size}/{item.color}) x {item.quantity}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
        <div className="mt-8 flow-root">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">Customer</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">Total</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono">{order.id.substring(0, 8)}...</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{(order.user as any)?.username || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">${order.totalAmount.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="rounded-md border-gray-300 text-sm"
                      >
                        <option>PENDING</option>
                        <option>PROCESSING</option>
                        <option>SHIPPED</option>
                        <option>DELIVERED</option>
                        <option>CANCELLED</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};