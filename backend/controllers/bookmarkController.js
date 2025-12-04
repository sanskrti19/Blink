import Bookmark from "../models/Bookmark.js";
import { categorizeBookmark, getTagColor } from "../utils/bookmarkHelpers.js";
import multer from "multer";

 
export const upload = multer({ storage: multer.memoryStorage() });

 
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

 
export const createBookmark = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const { url, title, folder } = req.body;

    const category = categorizeBookmark(url, title);
    const structuredTags = [
      { name: category, color: getTagColor(category) },
    ];

    const bookmarkData = {
      user: req.user.userId,
      title,
      url,
      folder: folder || "Uncategorized",
      tags: structuredTags,
    };

    const newBookmark = await Bookmark.create(bookmarkData);
    res.status(201).json(newBookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 
export const uploadBookmarks = async (req, res) => {
  try {
    const html = req.file.buffer.toString("utf-8");
    console.log("📂 Received HTML bookmark file for user:", req.user.userId);
    res.status(200).json({ message: "File received successfully!" });
  } catch (error) {
    console.error("Error uploading bookmarks:", error);
    res.status(500).json({ message: "Failed to upload bookmarks." });
  }
};
