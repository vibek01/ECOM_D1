import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Order } from '../../types';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemNames = order.items.map(item => item.name).join(', ');

  return (
    <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="font-mono text-sm text-slate-800">
            <span className="text-xs text-slate-500 block">Order ID</span>
            #{order.id.substring(0, 8)}...
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-slate-800 truncate" title={itemNames}>{itemNames}</p>
          </div>
          <div className="text-sm text-slate-800">
            <span className="text-xs text-slate-500 block">Total</span>
            ${order.totalAmount.toFixed(2)}
          </div>
          <div className="flex items-center justify-end">
            <span className="font-semibold px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800">{order.status}</span>
          </div>
        </div>
        <ChevronDown
          className={`ml-4 h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 p-6 space-y-6">
              {/* Shipping and Date Details */}
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Shipping Address</h4>
                  <p className="text-slate-600">{order.shippingAddress.fullName}</p>
                  <p className="text-slate-600">{order.shippingAddress.street}</p>
                  <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Order Details</h4>
                  <p className="text-slate-600"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-slate-600"><strong>Payment ID:</strong> {order.paymentDetails.paymentId}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Items Ordered</h4>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.variantId} className="flex items-center gap-4">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="h-16 w-16 rounded-md object-contain bg-slate-100 p-1"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-slate-500">Size: {item.size} / Color: {item.color}</p>
                        <p className="text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};