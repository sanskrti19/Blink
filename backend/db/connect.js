// db/connect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use the DATABASE_URL from your .env file
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;