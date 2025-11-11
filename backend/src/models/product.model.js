import mongoose, { Schema } from 'mongoose';

// --- MODIFIED: Added imageUrl to the variant schema ---
const productVariantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  imageUrl: { type: String, required: true }, // <-- ADDED
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    // --- REMOVED: The main imageUrl is no longer needed ---
    // imageUrl: { type: String, required: true }, 
    variants: [productVariantSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Product = mongoose.model('Product', productSchema);