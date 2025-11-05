import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminOnly = asyncHandler(async (req, _, next) => {
  if (req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'Forbidden: This resource is accessible by admins only.');
  }
  next();
});