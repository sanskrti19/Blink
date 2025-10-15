import express from "express";
 import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookmarkRoutes from "./routes/bookmarks.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import connectDB from './db/connect.js'
// --- 1. CONFIGURATION AND INITIALIZATION ---
dotenv.config();
connectDB(); // load env variables first

const app = express(); // <-- EXPRESS APP MUST BE INITIALIZED FIRST!

// Vite runs on a different port than CRA (3000). Added the Vite default port (5173) as well.
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://your-production-frontend.com'
];

// --- 2. MIDDLEWARE ---

// A. JSON BODY PARSER
app.use(express.json());

// B. CORS CONFIGURATION (Combined detailed logic and removed redundant app.use(cors()))
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true); 
        // Allow only listed origins
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));


// --- 3. ROUTES ---
app.use("/api/auth", authRoutes); 
app.use("/api/bookmarks", bookmarkRoutes);

// --- 4. DATABASE CONNECTION ---
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
