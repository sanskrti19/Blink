import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import  bookmarkRoutes from "./routes/bookmarks.js"

app.use("/api/bookmakrs",bookmarkRoutes);

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.send("Blink API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
