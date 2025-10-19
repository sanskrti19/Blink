// backend/controllers/bookmarkController.js

import Bookmark from '../models/Bookmark.js';
import { JSDOM } from 'jsdom';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

/**
 * Parses the Netscape Bookmark HTML file content into structured JSON data.
 * @param {string} htmlContent - The raw HTML content of the bookmark file.
 * @param {string} userId - The ID of the user uploading the bookmarks.
 * @returns {Array<object>} An array of structured bookmark objects.
 */
const parseHtmlBookmarks = (htmlContent, userId) => {
    const bookmarks = [];
    
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    let currentFolder = 'Uncategorized';
    
    const dlElement = document.querySelector('DL');
    if (!dlElement) {
        console.warn("Could not find the main <DL> element in the bookmark file.");
        return bookmarks;
    }

    dlElement.childNodes.forEach(node => {
        // Check for Folder (H3 tag)
        if (node.tagName === 'H3') {
            currentFolder = node.textContent ? node.textContent.trim() : 'Uncategorized';
        }

        // Check for Bookmark Link (DT tag containing an A tag)
        if (node.tagName === 'DT') {
            const anchor = node.querySelector('A');
            
            if (anchor) {
                const url = anchor.getAttribute('HREF'); 
                const title = anchor.textContent ? anchor.textContent.trim() : 'No Title';
                const tagsAttribute = anchor.getAttribute('TAGS');
                const tags = tagsAttribute ? tagsAttribute.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

                if (url && url.startsWith('http')) { 
                    bookmarks.push({
                        title,
                        url,
                        folder: currentFolder,
                        tags: tags,
                        // CRITICAL: Ensure this key matches your Mongoose Schema's user field
                        user: userId, 
                    });
                }
            }
        }
    });

    return bookmarks;
};


export const uploadBookmarks = async (req, res) => {
    
    if (!req.user || !req.user.userId) {
        console.error("401: Authentication failed for file upload.");
        return res.status(401).json({ message: "Not authorized. User token invalid or missing." });
    }
    
    if (!req.file) {
        return res.status(400).json({ message: "No bookmark file uploaded (Multer failed)." });
    }

    try {
        const userId = req.user.userId;
        const htmlContent = req.file.buffer.toString('utf-8');
        
        const structuredBookmarks = parseHtmlBookmarks(htmlContent, userId);
        
        console.log(`Parsed ${structuredBookmarks.length} valid bookmarks for insertion.`);

        // ordered: false allows some bookmarks to be inserted even if others fail validation (e.g. duplicates)
        await Bookmark.insertMany(structuredBookmarks, { ordered: false }); 

        res.status(201).json({ 
            message: `Successfully uploaded ${structuredBookmarks.length} bookmarks.`,
        });
        
    } catch (error) {
        console.error("Critical Upload Error:", error);
        
        return res.status(500).json({ 
            message: "An internal server error occurred during processing.",
            details: error.message 
        });
    }
};


export const getBookmarks = async (req, res) => {
    try {
        // Assuming your middleware populates req.user.userId
        const userId = req.user.userId; 
        
        // Ensure this query key 'user' matches the key used during insertion and in the Mongoose schema
        const bookmarks = await Bookmark.find({ user: userId }).sort({ folder: 1, title: 1 }); 
        
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Failed to retrieve bookmarks.' });
    }
};