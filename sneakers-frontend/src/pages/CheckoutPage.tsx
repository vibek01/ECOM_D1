import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppContainer } from '../components/layout/AppContainer';
import { OrderSummary } from '../components/ui/OrderSummary';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import type { RootState, AppDispatch } from '../store/store';
import { createNewOrder } from '../store/orderSlice';
import { clearCart } from '../store/cartSlice';

const ShippingSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type TShippingSchema = z.infer<typeof ShippingSchema>;

export const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: cartItems, subtotal } = useSelector((state: RootState) => ({
    items: state.cart.items,
    subtotal: state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
  }));
  const { status, error } = useSelector((state: RootState) => state.orders);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TShippingSchema>({
    resolver: zodResolver(ShippingSchema),
  });

  const onSubmit: SubmitHandler<TShippingSchema> = async (data) => {
    // In a real app, you would handle payment token generation here first.
    // We will simulate a successful payment.
    const paymentId = `sim_payment_${Date.now()}`;

    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        variantId: item.id, // The composite ID is used as the variant identifier
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        imageUrl: item.imageUrl,
      })),
      shippingAddress: data,
      totalAmount: subtotal + 5.00, // Assuming $5 shipping from OrderSummary
      paymentId,
    };

    const result = await dispatch(createNewOrder(orderData));
    if (createNewOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate(`/order-confirmation/${result.payload.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppContainer>
        <div className="py-16 sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl">Checkout</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
            <section className="lg:col-span-7">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">Shipping Information</h2>
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName">Full Name</label>
                    <Input id="fullName" {...register('fullName')} />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="street">Street Address</label>
                    <Input id="street" {...register('street')} />
                    {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="city">City</label>
                    <Input id="city" {...register('city')} />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <Input id="postalCode" {...register('postalCode')} />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="country">Country</label>
                    <Input id="country" {...register('country')} />
                    {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">Payment Details</h2>
                <div className="mt-6 h-32 flex items-center justify-center rounded-md bg-slate-100">
                  <p className="text-slate-500">Secure payment form (e.g., Stripe Elements) would be here.</p>
                </div>
              </div>
            </section>

            <section className="lg:col-span-5 mt-16 lg:mt-0">
              <OrderSummary />
              <div className="mt-6">
                <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? <Spinner size="sm" color="light" /> : 'Place Order'}
                </Button>
                {status === 'failed' && error && (
                  <p className="mt-4 text-center text-sm text-red-600">{error}</p>
                )}
              </div>
            </section>
          </form>
        </div>
      </AppContainer>
    </div>
  );
};