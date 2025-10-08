import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookmarkRoutes from "./routes/bookmarks.js"; // import routes AFTER imports

dotenv.config(); // load env variables

const app = express(); // <-- app MUST be declared BEFORE using it

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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
