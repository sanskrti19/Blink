 
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getBookmarks,
  createBookmark,
  uploadBookmarks,
  upload, 
  deleteBookmark, 
  updateBookmark,
} from "../controllers/bookmarkController.js";

const router = express.Router();

 
router.get("/", authMiddleware, getBookmarks);
router.post("/", authMiddleware, createBookmark);

router.put("/:id", authMiddleware, updateBookmark); 
 
router.delete("/:id", authMiddleware, deleteBookmark);

 
router.post("/upload", authMiddleware, upload.single("bookmarkFile"), uploadBookmarks);

export default router;
