import Bookmark from "../models/Bookmark.js";
import { JSDOM } from "jsdom";
import multer from "multer";

  
const COLORS = [
  "#6366F1", 
  "#10B981", 
  "#F59E0B", 
  "#EC4899", 
  "#3B82F6", 
  "#8B5CF6", 
  "#F43F5E", 
];
 
const getTagColor = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];

  
};
 
const categorizeBookmark = (url, title = "") => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (
    lowerUrl.includes("linkedin") ||
    lowerUrl.includes("notion") ||
    lowerUrl.includes("zoom") ||
    lowerUrl.includes("slack") ||
    lowerUrl.includes("microsoft") ||
    lowerUrl.includes("jira") ||
    lowerUrl.includes("confluence")
  ) {
    return "Work";
  }

  if (
    lowerUrl.includes("udemy") ||
    lowerUrl.includes("coursera") ||
    lowerUrl.includes("khanacademy") ||
    lowerUrl.includes("edx") ||
    lowerUrl.includes("wikipedia") ||
    lowerTitle.includes("learn") ||
    lowerTitle.includes("tutorial")
  ) {
    return "Education";
  }

  if (
    lowerUrl.includes("youtube") ||
    lowerUrl.includes("netflix") ||
    lowerUrl.includes("spotify") ||
    lowerUrl.includes("primevideo") ||
    lowerUrl.includes("hulu") ||
    lowerUrl.includes("hotstar")
  ) {
    return "Movies / Entertainment";
  }

  if (
    lowerUrl.includes("github") ||
    lowerUrl.includes("gitlab") ||
    lowerUrl.includes("stack") ||
    lowerUrl.includes("dev.to") ||
    lowerUrl.includes("vercel") ||
    lowerUrl.includes("react")
  ) {
    return "Development";
  }

  if (
    lowerUrl.includes("twitter") ||
    lowerUrl.includes("x.com") ||
    lowerUrl.includes("instagram") ||
    lowerUrl.includes("facebook") ||
    lowerUrl.includes("reddit") ||
    lowerUrl.includes("pinterest")
  ) {
    return "Social";
  }

  if (
    lowerUrl.includes("amazon") ||
    lowerUrl.includes("ebay") ||
    lowerUrl.includes("flipkart") ||
    lowerUrl.includes("shopify")
  ) {
    return "Shopping";
  }

  return "Uncategorized";
};
 
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

          // Convert any provided tags to structured objects
          let structuredTags = [];
          if (tagsAttribute) {
            const tagsArrayOfStrings = tagsAttribute
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0);

            structuredTags = tagsArrayOfStrings.map(tagName => ({
              name: tagName,
              color: getTagColor(tagName)
            }));
          } 
          if (structuredTags.length === 0 && url) {
            const category = categorizeBookmark(url, title);
            structuredTags.push({
              name: category,
              color: getTagColor(category)
            });
            console.log(`📂 Auto-categorized "${title}" -> ${category}`);
          }

          if (url && url.startsWith('http')) { 
            bookmarks.push({
              title,
              url,
              folder: currentFolder, 
              tags: structuredTags,
              user: userId, 
            });
          }
        }
      }

      if (node.tagName === 'DL') {
        processNodes(node.childNodes);
      }
      if (!structuredTags.length && url) {
  const categories = categorizeBookmarkMulti(url, title);
  structuredTags = categories.map(category => ({
    name: category,
    color: getTagColor(category)
  }));
  console.log(`📂 Auto-categorized "${title}" -> ${categories.join(", ")}`);
}

    });
  };

  processNodes(dlElement.childNodes);

  return bookmarks;
};

 
export const uploadBookmarks = async (req, res) => {
  if (!req.user || !req.user.userId)
    return res.status(401).json({ message: "Not authorized" });

  if (!req.file)
    return res.status(400).json({ message: "No bookmark file uploaded" });

  try {
    const userId = req.user.userId;
    const htmlContent = req.file.buffer.toString("utf-8");
    const structuredBookmarks = parseHtmlBookmarks(htmlContent, userId);

    const insertionResult = await Bookmark.insertMany(structuredBookmarks, { ordered: false });

    res.status(201).json({
      message: `Uploaded ${insertionResult.length} bookmarks.`,
      insertedCount: insertionResult.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload bookmarks", details: error.message });
  }
};
 
export const createBookmark = async (req, res) => {
  if (!req.user || !req.user.userId) return res.status(401).json({ message: "Authentication required." });

  try {
    const { url, title, tags } = req.body;

    let structuredTags = [];
    if (tags && tags.length > 0) {
      structuredTags = tags.map(tagName => ({ name: tagName, color: getTagColor(tagName) }));
    } else if (url) {
      const categories = categorizeBookmarkMulti(url, title);  
      structuredTags = categories.map(cat => ({ name: cat, color: getTagColor(cat) }));
    }

    const folder = categorizeBookmark(url, title);  

    const newBookmark = await Bookmark.create({
      user: req.user.userId,
      title,
      url,
      folder,
      tags: structuredTags,
    });

    res.status(201).json(newBookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
};

function assignTagsAndFolder(title, url) {
  // Example rules (you can expand)
  if (url.includes('youtube.com')) return { folder: 'Video', tags: [{ name: 'video', color: '#f59e0b' }] };
  if (url.includes('github.com')) return { folder: 'Code', tags: [{ name: 'code', color: '#10b981' }] };
  if (title.toLowerCase().includes('recipe')) return { folder: 'Food', tags: [{ name: 'food', color: '#ef4444' }] };

  return { folder: 'Misc', tags: [{ name: 'misc', color: '#6b7280' }] };
}
const { folder, tags } = assignTagsAndFolder(title, url);

const bookmark = new Bookmark({
  user: req.user._id,
  title,
  url,
  folder,
  tags
});
await bookmark.save();

 
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookmarks = await Bookmark.find({ user: userId }).sort({ folder: 1, title: 1 });
    res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Failed to retrieve bookmarks." });
  }
};
