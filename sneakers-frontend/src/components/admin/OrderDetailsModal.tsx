import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Package, User, Truck, DollarSign } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import type { Order } from '../../types';
import { updateOrderStatus } from '../../api/OrderApi';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh the order list
}

export const OrderDetailsModal = ({ order, isOpen, onClose, onUpdate }: OrderDetailsModalProps) => {
  const [newStatus, setNewStatus] = useState(order?.status || 'PENDING');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset local state whenever a new order is passed in
  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setError(null);
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateOrderStatus(order.id, newStatus);
      onUpdate(); // Trigger the refresh on the parent page
      onClose();   // Close the modal
    } catch (err) {
      setError('Failed to update order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isChanged = newStatus !== order.status;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Details`}>
      <div className="space-y-6 text-sm">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="font-mono text-lg font-semibold text-slate-800">#{order.id.substring(0, 8)}...</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-slate-600">
            <div className="flex items-center gap-2"><User size={16} /> {(order.user as any)?.username || 'N/A'}</div>
            <div className="flex items-center gap-2"><DollarSign size={16} /> ${order.totalAmount.toFixed(2)}</div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2"><Package size={16} /> Items Ordered</h4>
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {order.items.map(item => (
              <div key={item.variantId} className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-contain bg-slate-100 p-1" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-slate-500">Qty: {item.quantity} - Size: {item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Details */}
        <div>
          <h4 className="font-semibold text-slate-900 flex items-center gap-2"><Truck size={16} /> Shipping Address</h4>
          <div className="mt-2 text-slate-600">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="pt-4 border-t">
          <label htmlFor="status" className="block font-semibold text-slate-900 mb-2">Update Order Status</label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full rounded-md border-gray-300 text-sm focus:ring-teal-500 focus:border-teal-500"
          >
            <option>PENDING</option>
            <option>PROCESSING</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={!isChanged || isLoading}>
            {isLoading ? <Spinner size="sm" color="light" /> : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};