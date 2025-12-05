 
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getBookmarks,
  createBookmark,
  uploadBookmarks,
  upload, 
} from "../controllers/bookmarkController.js";

const router = express.Router();

 
router.get("/", authMiddleware, getBookmarks);
router.post("/", authMiddleware, createBookmark);

 
router.post("/upload", authMiddleware, upload.single("bookmarkFile"), uploadBookmarks);

export default router;
