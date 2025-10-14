import express from "express";
import Bookmark from "../models/Bookmark.js";
// 1. IMPORT THE AUTH MIDDLEWARE
import authenticateToken from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Get all bookmarks for the authenticated user
// **PROTECTED ROUTE**
router.get("/", authenticateToken, async (req, res) => {
  try {
    // 3. FILTER BOOKMARKS BY THE AUTHENTICATED USER'S ID (req.user.userId)
    const bookmarks = await Bookmark.find({ userId: req.user.userId });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new bookmark for the authenticated user
// **PROTECTED ROUTE**
router.post("/", authenticateToken, async (req, res) => {
  const { title, url, description, tags } = req.body;
  
  // 3. CREATE BOOKMARK AND ASSIGN IT TO THE AUTHENTICATED USER'S ID
  const bookmark = new Bookmark({ 
    title, 
    url, 
    description, 
    tags, 
    userId: req.user.userId // Get ID from the token payload
  });

  try {
    const saved = await bookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete bookmark by ID
// **PROTECTED ROUTE**
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // 3. ENSURE THE USER OWNS THE BOOKMARK BEFORE DELETING IT
    const bookmark = await Bookmark.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user.userId 
    });

    if (!bookmark) {
      // If no bookmark is found (either wrong ID or not the user's bookmark)
      return res.status(404).json({ message: "Bookmark not found or unauthorized to delete" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;