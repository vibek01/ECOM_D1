import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import { User } from '../models/user.model.js';

// --- FIX: Corrected the path to go up two levels instead of three ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const makeAdmin = async () => {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide a user email.');
    process.exit(1);
  }

  await connectDB();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`Error: User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = 'ADMIN';
    await user.save();

    console.log(`Successfully promoted user "${email}" to ADMIN.`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

makeAdmin();