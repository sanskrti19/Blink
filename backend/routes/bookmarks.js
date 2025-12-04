import Bookmark from '../models/Bookmark.js';
import { categorizeBookmark, getTagColor } from '../utils/bookmarkHelpers.js';
import express from "express";
import  authMiddleware  from "../middleware/authMiddleware.js";
import {
  getBookmarks,
 
  uploadBookmarks,
  upload,
} from "../controllers/bookmarkController.js";



export const createBookmark = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const { url, title, folder } = req.body;

         
        const category = categorizeBookmark(url, title);
 
        const structuredTags = [
            {
                name: category,
                color: getTagColor(category),
            }
        ];

        const bookmarkData = {
            user: req.user.userId,
            title,
            url,
            folder: folder || 'Uncategorized',
            tags: structuredTags
        };

        const newBookmark = await Bookmark.create(bookmarkData);

        res.status(201).json(newBookmark);

    } catch (error) {
        console.error('Error creating bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const router = express.Router();
router.get("/", getBookmarks);
router.post("/", createBookmark);
router.post("/upload", authMiddleware, upload.single("file"), uploadBookmarks);

export default router;
