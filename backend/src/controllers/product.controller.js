import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Fetch all products
 * @route   GET /api/v1/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products fetched successfully'));
});

/**
 * @desc    Fetch a single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export { getAllProducts, getProductById };