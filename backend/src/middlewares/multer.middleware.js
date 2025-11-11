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

// --- MODIFIED: Changed from .single('image') to .array('variantImages', 10) ---
// This allows up to 10 files to be uploaded with the field name 'variantImages'.
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit per file
}).array('variantImages', 10);