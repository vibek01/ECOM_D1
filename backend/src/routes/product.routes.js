import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/product.controller.js';

const router = Router();

// Public Routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

// We will add admin-only routes for creating/updating products here later.

export default router;