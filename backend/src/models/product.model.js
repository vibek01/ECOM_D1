import mongoose, { Schema } from 'mongoose';
const productVariantSchema = new Schema({
size: { type: String, required: true },
color: { type: String, required: true },
stock: { type: Number, required: true, min: 0, default: 0 },
});
const productSchema = new Schema(
{
name: { type: String, required: true, trim: true, index: true },
brand: { type: String, required: true, trim: true },
description: { type: String, required: true },
price: { type: Number, required: true, min: 0 },
imageUrl: { type: String, required: true },
variants: [productVariantSchema],
},
{
timestamps: true,
// --- FIX: Add a toJSON transform ---
// This is the definitive fix for the id vs _id issue.
// It automatically renames _id to id and removes the __v field
// whenever a document is converted to JSON (e.g., when sent in an API response).
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