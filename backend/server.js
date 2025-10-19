import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './db/connect.js';
// Correctly import the router file that contains the routes
import bookmarkRoutes from "./routes/bookmarks.js"; 
import authRoutes from "./routes/authRoutes.js"; 
 
dotenv.config();
connectDB(); 

const app = express(); 
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
 'https://your-production-frontend.com'
];
 

app.use(cors({
 origin: function (origin, callback) {
 if (!origin) return callback(null, true); 
 if (allowedOrigins.indexOf(origin) === -1) {
  const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
  return callback(new Error(msg), false);
 }
  return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
 credentials: true,
}));

 
app.use("/api/auth", authRoutes); 
app.use("/api/bookmarks", bookmarkRoutes);  
 
 