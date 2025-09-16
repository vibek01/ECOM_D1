import type { CartItem as CartItemType } from '../../types'; // Renaming to avoid conflict
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  // onQuantityChange: (itemId: string, newQuantity: number) => void;
  // onRemove: (itemId: string) => void;
}

export const CartItem = ({ item }: CartItemProps) => {
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
              <Link to={`/product/${item.productId}`}>{item.name}</Link>
            </h3>
            <p className="ml-4">${item.price.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {item.size} / {item.color}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">Qty {item.quantity}</p>

          <div className="flex">
            <Button
              variant="link"
              className="font-medium text-red-600 hover:text-red-500"
              // onClick={() => onRemove(item.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};