import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, totalAmount, paymentId } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'Cannot create an order with no items.');
  }

  // --- Real-world payment gateway integration would happen here ---
  // 1. You would have already received a payment token from the frontend.
  // 2. You would use a library like `stripe` to charge the user:
  //    const charge = await stripe.charges.create({ amount: totalAmount * 100, currency: 'usd', source: paymentToken });
  // 3. If the charge fails, you throw an error. If it succeeds, you proceed.
  // For this project, we'll simulate a successful payment.
  const paymentDetails = {
    paymentId: paymentId || `simulated_${Date.now()}`,
    paymentStatus: 'SUCCEEDED',
  };
  // --- End of payment simulation ---

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Decrement stock for each item in the order
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new ApiError(404, `Product with ID ${item.productId} not found.`);
      }

      // The variantId from the frontend is the composite ID, e.g., "product_id-variant_object_id"
      // We need the variant's actual _id to find it in the array.
      const variantObjectId = item.variantId.split('-')[1];
      const variant = product.variants.id(variantObjectId);

      if (!variant) {
        throw new ApiError(404, `Variant not found for product ${product.name}.`);
      }

      if (variant.stock < item.quantity) {
        throw new ApiError(400, `Not enough stock for ${product.name} (${item.color}/${item.size}). Available: ${variant.stock}, Requested: ${item.quantity}.`);
      }

      variant.stock -= item.quantity;
      await product.save({ session });
    }

    // Step 2: Create the order
    const order = new Order({
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      paymentDetails,
    });

    const createdOrder = await order.save({ session });

    // If all operations were successful, commit the transaction
    await session.commitTransaction();

    return res.status(201).json(new ApiResponse(201, createdOrder, 'Order placed successfully.'));
  } catch (error) {
    // If any error occurred, abort the transaction
    await session.abortTransaction();
    // Re-throw the original error to be caught by the global error handler
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully.'));
});

// --- Admin Controllers ---

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'username email').sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, orders, 'All orders fetched successfully.'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;

  if (!['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
    throw new ApiError(400, 'Invalid order status.');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  order.status = status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  const updatedOrder = await order.save();

  // In a real app, you would trigger an email notification to the user here.

  return res.status(200).json(new ApiResponse(200, updatedOrder, 'Order status updated successfully.'));
});

export { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
