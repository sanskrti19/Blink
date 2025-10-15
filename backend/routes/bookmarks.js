import express from "express";
import Bookmark from "../models/Bookmark.js";
 
import authenticateToken from "../middleware/authMiddleware.js"; 

 
 
 import { getUsersBookmarks,
   addSingleBookmark,
  saveBookmarks ,
deleteSingleBookmark} 
from '../controllers/bookmarkController.js';

const router = express.Router();
 
router.get("/", authenticateToken, async (req, res) => {
    try {
 
        const bookmarks = await Bookmark.find({ userId: req.user.userId }).sort({ dateAdded: -1 });
        res.json(bookmarks);
    } catch (err) { 
        res.status(500).json({ message: "Failed to retrieve bookmarks.", error: err.message });
    }
});
 
router.post("/", authenticateToken, async (req, res) => {
     
    const { title, url, description, tags, category } = req.body;
    
    const bookmark = new Bookmark({ 
        title, 
        url, 
        description, 
        tags, 
        category,  
        userId: req.user.userId 
    });

    try {
        const saved = await bookmark.save();
        res.status(201).json(saved);  
    } catch (err) {
       
        res.status(400).json({ message: "Failed to create bookmark.", error: err.message });
    }
});
 
router.put("/:id", authenticateToken, async (req, res) => {
    const updates = req.body;
    
    try {
        const bookmark = await Bookmark.findOneAndUpdate(
            { 
                _id: req.params.id, 
                userId: req.user.userId  
            },
            { $set: updates },  
            { new: true, runValidators: true } 
        );

        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found or unauthorized to update" });
        }

        res.json(bookmark); // Send the updated bookmark back
    } catch (err) {
        res.status(400).json({ message: "Failed to update bookmark.", error: err.message });
    }
});
 
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        
        const bookmark = await Bookmark.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!bookmark) {
            // Use 404 if the resource isn't found OR user is unauthorized (it's the same result)
            return res.status(404).json({ message: "Bookmark not found or unauthorized to delete" });
        }

        res.json({ message: "Bookmark deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete bookmark.", error: err.message });
    }
});

 

router.get('/',  getUsersBookmarks);  
router.post('/upload',  saveBookmarks); 

export default router;
 
 