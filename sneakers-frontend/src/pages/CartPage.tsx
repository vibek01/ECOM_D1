import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { AppContainer } from '../components/layout/AppContainer';
import { CartItem } from '../components/ui/CartItem';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';
import type { RootState } from '../store/store';

export const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <AppContainer>
      <div className="py-16 sm:py-24">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <section className="lg:col-span-7">
            <h2 className="sr-only">Items in your shopping cart</h2>

            {cartItems.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Looks like you haven't added anything yet.
                </p>
                <div className="mt-6">
                  <Link to={ROUTES.PRODUCTS}>
                    <Button>Continue Shopping</Button>
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Order summary */}
          {cartItems.length > 0 && (
            <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button size="lg" className="w-full">
                  Checkout
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </AppContainer>
  );
};