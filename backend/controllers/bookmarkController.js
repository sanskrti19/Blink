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

    const processNodes = (nodes) => {
        nodes.forEach(node => {
            if (node.tagName === 'H3') {
                currentFolder = node.textContent ? node.textContent.trim() : 'Uncategorized';
            }

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
                            user: userId, 
                        });
                    }
                }
            }

            if (node.tagName === 'DL') {
                processNodes(node.childNodes);
            }
        });
    };

    processNodes(dlElement.childNodes);

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

        const insertionResult = await Bookmark.insertMany(structuredBookmarks, { ordered: false }); 

        res.status(201).json({ 
            message: `Successfully uploaded ${insertionResult.length} bookmarks.`,
            insertedCount: insertionResult.length
        });
        
    } catch (error) {
  
        if (error.name === 'ValidationError') {
            console.error("Mongoose Validation Error:", error.message);
           
        } else if (error.name === 'MongoBulkWriteError' && error.writeErrors) {
            console.error(`Bulk Write Error: ${error.message}. First error details:`, error.writeErrors[0].errmsg);
            return res.status(400).json({ 
                message: "Some bookmarks failed validation during upload. Check console for details.",
                details: error.writeErrors[0].errmsg 
            });
        }
        
        console.error("Critical Upload Error:", error);
        
        return res.status(500).json({ 
            message: "An internal server error occurred during processing.",
            details: error.message 
        });
    }
};


export const getBookmarks = async (req, res) => {
    try {
      
        const userId = req.user.userId; 
        const bookmarks = await Bookmark.find({ user: userId }).sort({ folder: 1, title: 1 }); 
        
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ message: 'Failed to retrieve bookmarks.' });
    }
};
