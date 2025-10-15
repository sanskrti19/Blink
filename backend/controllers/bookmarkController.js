import Bookmark from '../models/Bookmark.js';
import mongoose from 'mongoose';

/**
 * --- BULK IMPORT LOGIC (For HTML Upload) ---
 * Renaming to better reflect the use in your routes.
 */
export const saveBookmarks = async (req, res) => {
    // ... (Your saveBookmarks logic here)
    try {
        // req.user.userId is populated by the authenticateToken middleware
        const userId = req.user.userId; 
        const newBookmarks = req.body;

        if (!Array.isArray(newBookmarks)) {
            return res.status(400).json({ msg: "Request body must be an array of bookmarks." });
        }
        // ... (rest of your logic)
        
        // Clear all existing bookmarks for this user (to replace with new file content)
        await Bookmark.deleteMany({ userId });

        // Prepare new bookmarks for insertion
        const bookmarksToInsert = newBookmarks.map(b => ({
            userId: new mongoose.Types.ObjectId(userId),
            url: b.url,
            title: b.title,
            folder: b.folder || 'Root',
            tags: b.tags || '',
        }));

        // Insert all new bookmarks
        if (bookmarksToInsert.length > 0) {
            await Bookmark.insertMany(bookmarksToInsert);
        }

        res.status(201).json({ 
            msg: `Successfully imported and saved ${bookmarksToInsert.length} bookmarks.`,
            count: bookmarksToInsert.length
        });

    } catch (err) {
        console.error('Error saving bookmarks:', err);
        res.status(500).json({ msg: 'Server error during bookmark saving.', error: err.message });
    }
};

/**
 * --- SINGLE GET LOGIC (For Home Page Load) ---
 */
export const getUsersBookmarks = async (req, res) => {
    // ... (Your getUsersBookmarks logic here)
    try {
        const userId = req.user.userId;
        const bookmarks = await Bookmark.find({ userId }).sort({ folder: 1, title: 1 });
        res.status(200).json(bookmarks);
    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        res.status(500).json({ msg: 'Server error fetching bookmarks.', error: err.message });
    }
};

/**
 * --- SINGLE ADD LOGIC ---
 */
export const addSingleBookmark = async (req, res) => {
    // ... (Your addSingleBookmark logic here)
    const { title, url, folder, tags } = req.body;
    // ... (rest of your logic)
    const bookmark = new Bookmark({ 
        title, url, folder, tags, userId: req.user.userId 
    });
    try {
        const saved = await bookmark.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/**
 * --- SINGLE DELETE LOGIC ---
 */
export const deleteSingleBookmark = async (req, res) => {
    // ... (Your deleteSingleBookmark logic here)
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
};