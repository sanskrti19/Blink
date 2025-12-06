import Bookmark from "../models/Bookmark.js";
import { categorizeBookmark, getTagColor } from "../utils/bookmarkHelpers.js";
import multer from "multer";
import * as cheerio from 'cheerio';  

export const upload = multer({ storage: multer.memoryStorage() });

export const createBookmark = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const { url, title, folder } = req.body;
    const category = categorizeBookmark(url, title);
    const structuredTags = [{ name: category, color: getTagColor(category) }];

    const bookmarkData = {
      user: req.user.userId,
      title,
      url,
      folder: folder || "Uncategorized",
      tags: structuredTags,
    };

    const newBookmark = await Bookmark.create(bookmarkData);
    return res.status(201).json(newBookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    console.log("getBookmarks - req.user:", req.user); 
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userId = req.user.userId;
    const bookmarks = await Bookmark.find({ user: userId }).sort({ folder: 1, title: 1 });
    return res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return res.status(500).json({ message: "Failed to retrieve bookmarks." });
  }
};

export const uploadBookmarks = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userId = req.user.userId;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const html = req.file.buffer.toString("utf-8");
    const $ = cheerio.load(html);
    const linksToSave = [];

    $('A').each((i, link) => {
      const url = $(link).attr('href');
      const title = $(link).text().trim();
      const folderElement = $(link).closest('DL').prevAll('H3').first();
      const folder = folderElement.length ? folderElement.text().trim() : "Imported";

      if (url && title) {
        const category = categorizeBookmark(url, title);
        const structuredTags = [{ name: category, color: getTagColor(category) }];

        linksToSave.push({
          user: userId,
          title: title,
          url: url,
          folder: folder,
          tags: structuredTags,
        });
      }
    });

    if (linksToSave.length > 0) {
      await Bookmark.insertMany(linksToSave);
    }

    return res.status(200).json({ 
      message: `${linksToSave.length} bookmarks imported successfully!`,
      count: linksToSave.length
    });
  } catch (error) {
    console.error("Error processing imported bookmarks:", error);
    return res.status(500).json({ message: "Failed to parse and save bookmarks." });
  }
};

export const updateBookmark = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const { id } = req.params;
    const { title, url, folder, tags, description } = req.body;

    const updateData = {
      title,
      url,
      folder: folder || "Uncategorized",
      description
    };

    if (tags) {
      updateData.tags = tags;
    } else {
      const category = categorizeBookmark(url, title);
      updateData.tags = [{ name: category, color: getTagColor(category) }];
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBookmark) {
      return res.status(404).json({ message: "Bookmark not found or unauthorized to update." });
    }

    return res.status(200).json(updatedBookmark);
  } catch (error) {
    console.error("Error updating bookmark:", error);
    return res.status(400).json({ message: "Failed to update bookmark.", error: error.message });
  }
};




export const deleteBookmark = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const { id } = req.params;

    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: id,
      user: req.user.userId
    });

    if (!deletedBookmark) {
      return res.status(404).json({ message: "Bookmark not found or you are unauthorized to delete it." });
    }

    return res.status(200).json({ message: "Bookmark deleted successfully." });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return res.status(500).json({ message: "Failed to delete bookmark due to a server error." });
  }
};

