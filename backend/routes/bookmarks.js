import express from "express";

import { getBookmarks, uploadBookmarks, upload } from '../controllers/bookmarkController.js'; 
import Bookmark from "../models/Bookmark.js";
import protect from '../middleware/authMiddleware.js';

const router = express.Router(); 
router.get('/', protect, getBookmarks);

router.post('/upload', protect, upload.single('bookmarkFile'), uploadBookmarks); 
 


router.post("/", protect, async (req, res) => {

    const { title, url, description, tags, category } = req.body;
    
    const bookmark = new Bookmark({ 
        title, 
        url, 
        description, 
        tags, 
        category,  
    
        user: req.user.userId 
    });

    try {
        const saved = await bookmark.save();
        res.status(201).json(saved); 
    } catch (err) {
        res.status(400).json({ message: "Failed to create bookmark.", error: err.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    const updates = req.body;
    
    try {
        const bookmark = await Bookmark.findOneAndUpdate(
            { 
                _id: req.params.id, 
                
                user: req.user.userId 
            },
            { $set: updates }, 
            { new: true, runValidators: true } 
        );

        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found or unauthorized to update" });
        }

        res.json(bookmark); 
    } catch (err) {
        res.status(400).json({ message: "Failed to update bookmark.", error: err.message });
    }
});
router.delete("/:id", protect, async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({ 
            _id: req.params.id, 
          
            user: req.user.userId 
        });

        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found or unauthorized to delete" });
        }

        res.json({ message: "Bookmark deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete bookmark.", error: err.message });
    }
});

export default router;
