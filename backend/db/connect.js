// db/connect.js
import mongoose from 'mongoose';
// REMOVE: import dotenv from 'dotenv';
// REMOVE: dotenv.config(); // The .env is loaded once in server.js

const connectDB = async () => {
  try {
    // *** CRITICAL FIX: Use MONGO_URI, which is defined in your .env file. ***
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully. 🚀');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;