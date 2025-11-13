import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const router = Router();

// --- Protected User Routes ---
router.use(verifyJWT); // All routes below this are protected

router.route('/').post(createOrder);
router.route('/my-orders').get(getMyOrders);

// --- Protected Admin Routes ---
router.route('/admin').get(adminOnly, getAllOrders);
router.route('/admin/:id').put(adminOnly, updateOrderStatus);

export default router;