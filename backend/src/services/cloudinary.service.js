import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, 'File path is required for upload.');
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary upload failed:', error);
    throw new ApiError(500, 'Failed to upload file to Cloudinary.');
  }
};

/**
 * Deletes an asset from Cloudinary using its public ID.
 * @param {string} imageUrl - The full URL of the image stored in the database.
 * @returns {object} The Cloudinary deletion response object.
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID from the full URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    if (!publicId) {
      throw new ApiError(400, 'Could not derive public ID from URL.');
    }

    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw new ApiError(500, 'Failed to delete file from Cloudinary.');
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };