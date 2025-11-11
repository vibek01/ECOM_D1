import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/admin.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// --- Public Routes ---
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

// --- Admin-Only Routes ---

// --- MODIFIED: Replaced upload.single('image') with the new 'upload' middleware ---
router
  .route('/')
  .post(
    verifyJWT,
    adminOnly,
    upload, // Use the new array upload middleware
    createProduct
  );

// --- MODIFIED: Replaced upload.single('image') with the new 'upload' middleware ---
router
  .route('/:id')
  .put(
    verifyJWT,
    adminOnly,
    upload, // Use the new array upload middleware
    updateProduct
  )
  .delete(verifyJWT, adminOnly, deleteProduct);

export default router;