import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  // --- Execute all database queries in parallel for maximum efficiency ---
  const [
    totalRevenueData,
    newCustomersCount,
    pendingOrdersCount,
    totalProductsCount,
    recentOrders
  ] = await Promise.all([
    // 1. Calculate Total Revenue using MongoDB Aggregation
    Order.aggregate([
      {
        $match: { status: { $in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] } } // Only count revenue from successful orders
      },
      {
        $group: {
          _id: null, // Group all documents into one
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]),

    // 2. Count New Customers (e.g., created in the last 30 days)
    User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    }),

    // 3. Count Pending Orders
    Order.countDocuments({ status: 'PENDING' }),

    // 4. Count Total Products
    Product.countDocuments(),

    // 5. Get the 5 most recent orders
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'username') // Populate user to show username
  ]);

  // --- Format the data for a clean response ---
  const stats = {
    totalRevenue: totalRevenueData[0]?.totalRevenue || 0,
    newCustomers: newCustomersCount,
    pendingOrders: pendingOrdersCount,
    totalProducts: totalProductsCount,
    recentOrders: recentOrders
  };

  return res.status(200).json(new ApiResponse(200, stats, 'Dashboard statistics fetched successfully.'));
});

export { getDashboardStats };