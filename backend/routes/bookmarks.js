import express from "express";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// Get all bookmarks
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find();
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new bookmark
router.post("/", async (req, res) => {
  const { title, url, description, tags } = req.body;
  const bookmark = new Bookmark({ title, url, description, tags });

  try {
    const saved = await bookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete bookmark
router.delete("/:id", async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
