import mongoose, { Schema } from 'mongoose';

const productVariantSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String, // This will store the URL from Cloudinary
      required: true,
    },
    variants: [productVariantSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Product = mongoose.model('Product', productSchema);