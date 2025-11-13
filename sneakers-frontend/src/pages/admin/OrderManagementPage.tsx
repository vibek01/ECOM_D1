import { useEffect, useState } from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus } from '../../api/OrderApi';
import type { Order } from '../../types';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // --- NEW STATE FOR UPDATE CONFIRMATION ---
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<{ order: Order; newStatus: string } | null>(null);
  const [pendingStatusChanges, setPendingStatusChanges] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // --- MODIFIED: This function is now called from the confirmation modal ---
  const handleConfirmStatusUpdate = async () => {
    if (!orderToUpdate) return;

    try {
      await updateOrderStatus(orderToUpdate.order.id, orderToUpdate.newStatus);
      setSuccessMessage(`Order #${orderToUpdate.order.id.substring(0, 8)} status updated to ${orderToUpdate.newStatus}.`);
      
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert('Failed to update order status.');
    } finally {
      // Clean up state
      setIsUpdateModalOpen(false);
      setOrderToUpdate(null);
      setPendingStatusChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[orderToUpdate.order.id];
        return newChanges;
      });
    }
  };

  // --- NEW: Handlers for the update process ---
  const handleStatusSelectChange = (orderId: string, newStatus: string) => {
    setPendingStatusChanges(prev => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handleOpenUpdateModal = (order: Order) => {
    const newStatus = pendingStatusChanges[order.id];
    if (newStatus && newStatus !== order.status) {
      setOrderToUpdate({ order, newStatus });
      setIsUpdateModalOpen(true);
    }
  };

  // --- NEW: Handler for the details modal ---
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      {/* Modal for viewing order details */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={`Order Details: #${selectedOrder?.id.substring(0, 8)}`}>
        {selectedOrder && (
          <div className="text-sm space-y-3">
            <p><strong>Customer:</strong> {(selectedOrder.user as any)?.username || 'N/A'}</p>
            <p><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4 className="font-bold pt-2 border-t">Items:</h4>
            <ul className="list-disc pl-5">
              {selectedOrder.items.map(item => (
                <li key={item.variantId}>{item.name} ({item.size}/{item.color}) x {item.quantity}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* --- NEW: Modal for confirming status update --- */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Confirm Status Change">
        {orderToUpdate && (
          <div>
            <p className="text-slate-700">
              Are you sure you want to change the status for order{' '}
              <span className="font-bold font-mono text-slate-900">#{orderToUpdate.order.id.substring(0, 8)}</span> from{' '}
              <span className="font-bold text-slate-900">{orderToUpdate.order.status}</span> to{' '}
              <span className="font-bold text-slate-900">{orderToUpdate.newStatus}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmStatusUpdate}>Confirm Update</Button>
            </div>
          </div>
        )}
      </Modal>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
        
        {/* --- NEW: Success Message / Toast Simulation --- */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 flex items-center gap-3 rounded-md bg-emerald-50 p-4 text-sm font-medium text-emerald-800 border border-emerald-200"
            >
              <CheckCircle className="h-5 w-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

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
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => {
                  const pendingStatus = pendingStatusChanges[order.id];
                  const isChanged = pendingStatus && pendingStatus !== order.status;
                  
                  return (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono">{order.id.substring(0, 8)}...</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{(order.user as any)?.username || 'N/A'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">${order.totalAmount.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {/* --- MODIFIED: The select now updates local state, not the API --- */}
                        <select 
                          value={pendingStatus || order.status} 
                          onChange={(e) => handleStatusSelectChange(order.id, e.target.value)}
                          className="rounded-md border-gray-300 text-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option>PENDING</option>
                          <option>PROCESSING</option>
                          <option>SHIPPED</option>
                          <option>DELIVERED</option>
                          <option>CANCELLED</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* --- NEW: Update button, enabled only when there's a change --- */}
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => handleOpenUpdateModal(order)}
                            disabled={!isChanged}
                          >
                            Save
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};