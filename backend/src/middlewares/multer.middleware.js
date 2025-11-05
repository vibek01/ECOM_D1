import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the path for the temporary storage directory
const tempDir = './public/temp';

// Ensure the temporary directory exists
fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // We use a simple unique filename strategy
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  // Optional: Add file size and type limits here for security
  // limits: { fileSize: 1024 * 1024 * 5 }, // e.g., 5 MB limit
});