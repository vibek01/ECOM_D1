import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

// --- PUBLIC CONTROLLERS (No Changes) ---
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});


// --- ADMIN-ONLY CONTROLLERS (MODIFIED) ---

/**
 * @description Create a new product with variant-specific images
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, description, price } = req.body;
  const variants = JSON.parse(req.body.variants || '[]');

  if (!name || !brand || !description || !price || variants.length === 0) {
    throw new ApiError(400, 'All fields and at least one variant are required.');
  }

  const files = req.files;
  if (!files || files.length !== variants.length) {
    throw new ApiError(400, 'Each variant must have a corresponding image.');
  }

  // Upload all variant images to Cloudinary concurrently
  const imageUploadPromises = files.map(file => uploadOnCloudinary(file.path));
  const cloudinaryResponses = await Promise.all(imageUploadPromises);

  // Assign uploaded image URLs to their respective variants
  const variantsWithImages = variants.map((variant, index) => {
    const cloudinaryResponse = cloudinaryResponses[index];
    if (!cloudinaryResponse || !cloudinaryResponse.url) {
      throw new ApiError(500, `Failed to upload image for variant ${index + 1}.`);
    }
    return {
      ...variant,
      imageUrl: cloudinaryResponse.url,
    };
  });

  const product = await Product.create({
    name,
    brand,
    description,
    price,
    variants: variantsWithImages,
  });

  return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

/**
 * @description Update an existing product and its variants/images
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }

  const { name, brand, description, price } = req.body;
  const newVariantsData = JSON.parse(req.body.variants || '[]');
  const files = req.files || [];

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  const oldImageUrls = product.variants.map(v => v.imageUrl);
  const finalVariants = [];
  const finalImageUrls = [];
  let fileIndex = 0;

  // Upload new images and prepare the final variants array
  const uploadPromises = newVariantsData.map(async (variant) => {
    // If a variant has an imageUrl, it's an existing one.
    if (variant.imageUrl) {
      finalImageUrls.push(variant.imageUrl);
      return variant;
    }
    // If no imageUrl, it's a new variant needing a new image.
    else {
      const file = files[fileIndex++];
      if (!file) {
        throw new ApiError(400, 'Mismatch between new variants and uploaded images.');
      }
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      if (!cloudinaryResponse || !cloudinaryResponse.url) {
        throw new ApiError(500, 'Failed to upload a new variant image.');
      }
      finalImageUrls.push(cloudinaryResponse.url);
      return { ...variant, imageUrl: cloudinaryResponse.url };
    }
  });

  const processedVariants = await Promise.all(uploadPromises);

  // Determine which old images to delete from Cloudinary
  const imagesToDelete = oldImageUrls.filter(url => !finalImageUrls.includes(url));
  if (imagesToDelete.length > 0) {
    await Promise.all(imagesToDelete.map(url => deleteFromCloudinary(url)));
  }

  // Update product fields
  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.price = price || product.price;
  product.variants = processedVariants;

  const updatedProduct = await product.save();

  return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

/**
 * @description Delete a product and all its variant images from Cloudinary
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // Delete all variant images from Cloudinary concurrently
  if (product.variants && product.variants.length > 0) {
    const deletePromises = product.variants.map(variant => deleteFromCloudinary(variant.imageUrl));
    await Promise.all(deletePromises);
  }

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