import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './db/connect.js';
 
import bookmarkRoutes from "./routes/bookmarks.js"; 
import authRoutes from "./routes/authRoutes.js"; 
 
dotenv.config(); 
const PORT = process.env.PORT || 5000;

// Initialize the app
const app = express(); 
app.use(express.json());

// --- CORS Configuration ---
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
 
app.get('/', (req, res) => {
    res.send('API Server is Running!');
});
 
const startServer = async () => {
    try {
      
        await connectDB();
         
        app.listen(PORT, () => {
            console.log(`Server is running successfully on port ${PORT}. Ready to accept connections.`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
         
        process.exit(1); 
    }
};
 
startServer();
