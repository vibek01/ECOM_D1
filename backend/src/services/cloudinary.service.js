import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

/**
 * Uploads a file from a local path to Cloudinary.
 * @param {string} localFilePath - The path to the file on the local server.
 * @returns {object} The Cloudinary upload response object.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, 'File path is required for upload.');
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect the file type (image, video, etc.)
    });

    // File has been uploaded successfully, now remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // If the upload fails, make sure to remove the temporary local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary upload failed:', error);
    throw new ApiError(500, 'Failed to upload file to Cloudinary.');
  }
};

export { uploadOnCloudinary };