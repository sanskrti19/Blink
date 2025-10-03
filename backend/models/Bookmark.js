import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bookmark", bookmarkSchema);
