import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './db/connect.js';
// Correctly import the router file that contains the routes
import bookmarkRoutes from "./routes/bookmarks.js"; 
import authRoutes from "./routes/authRoutes.js"; 
 
dotenv.config();

// Define the port using the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Initialize the app
const app = express(); 
app.use(express.json());

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Common React dev port (Vite default)
  'http://localhost:3000', // Common React dev port (Create React App default)
  'https://your-production-frontend.com' // Placeholder for production
];
 
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
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

// --- Routes ---
app.use("/api/auth", authRoutes); 
app.use("/api/bookmarks", bookmarkRoutes);  

// Basic route for testing server health
app.get('/', (req, res) => {
    res.send('API Server is Running!');
});

// --- Server Startup ---
// The process is now asynchronous to handle the database connection gracefully.
const startServer = async () => {
    try {
        // Wait for the database connection before starting the HTTP server
        await connectDB();
        
        // This is the CRITICAL line that was missing!
        app.listen(PORT, () => {
            console.log(`Server is running successfully on port ${PORT}. Ready to accept connections.`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        // Exit process if DB connection or server start fails
        process.exit(1); 
    }
};

// Start the whole application
startServer();
