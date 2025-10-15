import express from "express";
import Bookmark from "../models/Bookmark.js";
 
import authenticateToken from "../middleware/authMiddleware.js"; 

const router = express.Router();
 
router.get("/", authenticateToken, async (req, res) => {
  try {
   
    const bookmarks = await Bookmark.find({ userId: req.user.userId });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
router.post("/", authenticateToken, async (req, res) => {
  const { title, url, description, tags } = req.body;
   
  const bookmark = new Bookmark({ 
    title, 
    url, 
    description, 
    tags, 
    userId: req.user.userId  
  });

  try {
    const saved = await bookmark.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
 
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    
    const bookmark = await Bookmark.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user.userId 
    });

    if (!bookmark) {
    
      return res.status(404).json({ message: "Bookmark not found or unauthorized to delete" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;