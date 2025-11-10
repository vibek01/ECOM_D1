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
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link to={`/product/${item.productId}`} className="font-medium text-gray-700 hover:text-gray-800">
                  {item.name}
                </Link>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">{item.color}</p>
              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{item.size}</p>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => dispatch(decrementQuantity(item.id))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-sm font-medium text-gray-700">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => dispatch(incrementQuantity(item.id))}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
            </div>

             <div className="absolute right-0 top-0">
                <Button
                    variant="ghost"
                    className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => dispatch(removeItem(item.id))}
                >
                    <span className="sr-only">Remove</span>
                    <X className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>
        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
          {item.stock > 0 ? (
            <svg className="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>          
          ) : (
             <svg className="h-5 w-5 flex-shrink-0 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6z" clipRule="evenodd" />
            </svg>
          )}
          <span>{item.stock > 0 ? `In stock` : `Out of stock`}</span>
        </p>
      </div>
    </li>
  );
};