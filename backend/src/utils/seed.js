import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { User } from '../models/user.model.js';

dotenv.config({ path: '../../.env' });

const makeAdmin = async () => {
  // Get the email from the command line arguments
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
    // Ensure the database connection is closed
    await mongoose.disconnect();
    process.exit(0);
  }
};

makeAdmin();