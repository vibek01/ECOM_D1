import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';

const router = Router();

// All routes in this file are for admins only and require authentication.
router.use(verifyJWT, adminOnly);

// Define the route for fetching dashboard statistics
router.route('/stats').get(getDashboardStats);

export default router;