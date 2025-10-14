import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookmarkRoutes from "./routes/bookmarks.js"; 
import authRoutes from "./routes/authRoutes.js"; 

const allowedOrigins = ['http://localhost:3000', 'https://your-production-frontend.com'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true); 
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // IMPORTANT: Allows cookies (if you used them, but often ignored for JWT)
}));


dotenv.config(); // load env variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// 2. ADD AUTH ROUTES
app.use("/api/auth", authRoutes); // <--- NEW ROUTE FOR LOGIN/REGISTER
app.use("/api/bookmarks", bookmarkRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 