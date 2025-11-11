import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

// --- MODIFIED: getAllProducts now handles filtering, sorting, and searching ---
const getAllProducts = asyncHandler(async (req, res) => {
  const { search, brand, color, size, minPrice, maxPrice, sort } = req.query;

  // --- Build the MongoDB Query Object ---
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  if (brand) {
    // Assumes brands are comma-separated in the query string (e.g., ?brand=NIKE,Adidas)
    query.brand = { $in: brand.split(',') };
  }

  if (color) {
    query['variants.color'] = { $in: color.split(',') };
  }
  
  if (size) {
    query['variants.size'] = { $in: size.split(',') };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }
  
  // --- Build the Sort Object ---
  let sortOptions = {};
  switch (sort) {
    case 'priceAsc':
      sortOptions = { price: 1 };
      break;
    case 'priceDesc':
      sortOptions = { price: -1 };
      break;
    case 'nameAsc':
      sortOptions = { name: 1 };
      break;
    case 'nameDesc':
      sortOptions = { name: -1 };
      break;
    default:
      // Default sort (e.g., by creation date or relevance)
      sortOptions = { createdAt: -1 };
      break;
  }

  const products = await Product.find(query).sort(sortOptions);
  
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

// --- ADMIN CONTROLLERS (No Changes) ---
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

  const imageUploadPromises = files.map(file => uploadOnCloudinary(file.path));
  const cloudinaryResponses = await Promise.all(imageUploadPromises);

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
  const finalImageUrls = [];
  let fileIndex = 0;

  const uploadPromises = newVariantsData.map(async (variant) => {
    if (variant.imageUrl) {
      finalImageUrls.push(variant.imageUrl);
      return variant;
    }
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

  const imagesToDelete = oldImageUrls.filter(url => !finalImageUrls.includes(url));
  if (imagesToDelete.length > 0) {
    await Promise.all(imagesToDelete.map(url => deleteFromCloudinary(url)));
  }

  product.name = name || product.name;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.price = price || product.price;
  product.variants = processedVariants;

  const updatedProduct = await product.save();

  return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID format.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

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