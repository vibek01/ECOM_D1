import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plus, Minus, X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { Button } from '../common/Button';
import { incrementQuantity, decrementQuantity, removeItem } from '../../store/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/product/${item.productId}`}>{item.name}</Link> {/* CORRECTED (was implicitly correct, now explicitly) */}
            </h3>
            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {item.size} / {item.color}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center rounded-md border border-slate-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(decrementQuantity(item.id))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(incrementQuantity(item.id))}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex">
            <Button
              variant="link"
              className="font-medium text-red-600 hover:text-red-500"
              onClick={() => dispatch(removeItem(item.id))}
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};