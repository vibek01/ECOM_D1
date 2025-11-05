import mongoose from 'mongoose'; // <-- Import mongoose
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

// --- PUBLIC CONTROLLERS ---
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  // FIX: Add validation to check if the ID is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

// --- ADMIN-ONLY CONTROLLERS ---
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, price, variants } = req.body;

  if (!name || !brand || !description || !price) {
    throw new ApiError(400, 'All fields (name, brand, description, price) are required.');
  }
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, 'Product image is required.');
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, 'Error while uploading image.');
  }

  const product = await Product.create({
    name,
    brand,
    description,
    price,
    imageUrl: image.url,
    variants: variants ? JSON.parse(variants) : [],
  });

  return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, price, variants } = req.body;
  const { id } = req.params;

  // FIX: Add validation to check if the ID is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  let newImageUrl = product.imageUrl;
  if (req.file) {
    const imageLocalPath = req.file.path;
    const newImage = await uploadOnCloudinary(imageLocalPath);
    if (!newImage) throw new ApiError(500, 'Error while uploading new image.');
    newImageUrl = newImage.url;
    await deleteFromCloudinary(product.imageUrl);
  }

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

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // FIX: Add validation to check if the ID is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  await deleteFromCloudinary(product.imageUrl);
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