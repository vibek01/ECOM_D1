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
router
  .route('/')
  .post(
    verifyJWT,
    adminOnly,
    upload.single('image'), // 'image' must match the field name in the form data
    createProduct
  );

router
  .route('/:id')
  .put(
    verifyJWT,
    adminOnly,
    upload.single('image'),
    updateProduct
  )
  .delete(verifyJWT, adminOnly, deleteProduct);

export default router;