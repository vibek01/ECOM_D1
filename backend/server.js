import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import configureCloudinary from './src/config/cloudinary.js';
import { errorHandler } from './src/middlewares/error.middleware.js';

// Import Routers
import productRouter from './src/routes/product.routes.js';
import authRouter from './src/routes/auth.routes.js';
import orderRouter from './src/routes/order.routes.js';
import adminRouter from './src/routes/admin.routes.js'; // <-- ADD THIS LINE

// Load environment variables
dotenv.config({
  path: './.env'
});

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Configure Cloudinary
configureCloudinary();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// --- API Routes ---
app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/admin', adminRouter); // <-- AND ADD THIS LINE

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Sneakers API is running...');
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});