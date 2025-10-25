import Bookmark from '../models/Bookmark.js';
import { categorizeBookmark, getTagColor } from '../utils/bookmarkHelpers.js';

export const createBookmark = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const { url, title, folder } = req.body;

        // Auto-categorize based on URL or title
        const category = categorizeBookmark(url, title);

        // Assign color for the tag
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
