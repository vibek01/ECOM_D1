import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

// --- PUBLIC CONTROLLERS (No changes) ---
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

// --- ADMIN-ONLY CONTROLLERS (New) ---

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, price, variants } = req.body;

  // 1. Validation
  if (!name || !brand || !description || !price) {
    throw new ApiError(400, 'All fields (name, brand, description, price) are required.');
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, 'Product image is required.');
  }

  // 2. Upload image to Cloudinary
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, 'Error while uploading image.');
  }

  // 3. Create product in database
  const product = await Product.create({
    name,
    brand,
    description,
    price,
    imageUrl: image.url,
    variants: variants ? JSON.parse(variants) : [], // Variants are sent as a JSON string
  });

  return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, price, variants } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  let newImageUrl = product.imageUrl;

  // If a new image is uploaded, handle the update
  if (req.file) {
    const imageLocalPath = req.file.path;
    const newImage = await uploadOnCloudinary(imageLocalPath);
    if (!newImage) {
      throw new ApiError(500, 'Error while uploading new image.');
    }
    newImageUrl = newImage.url;

    // Delete the old image from Cloudinary
    await deleteFromCloudinary(product.imageUrl);
  }

  // Update product fields
  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.price = price || product.price;
  product.imageUrl = newImageUrl;
  if (variants) {
    product.variants = JSON.parse(variants);
  }

  const updatedProduct = await product.save();

  return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // 1. Delete image from Cloudinary
  await deleteFromCloudinary(product.imageUrl);

  // 2. Delete product from database
  await product.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};