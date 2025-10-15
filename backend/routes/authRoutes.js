import express from "express";
import { 
    getUsersBookmarks, 
    saveBookmarks,
    addSingleBookmark, 
    deleteSingleBookmark 
} from "../controllers/bookmarkController.js"; 
 
import authenticateToken from "../middleware/authMiddleware.js"; 

const router = express.Router();
 
router.get("/", authenticateToken, getUsersBookmarks);
 
router.post("/", authenticateToken, saveBookmarks);

 
router.delete("/:id", authenticateToken, deleteSingleBookmark);

export default router;
