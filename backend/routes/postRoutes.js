import express from "express";
import { upload } from "../config/cloudinary.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getPosts,
  getSavedPosts,
  getPostById,
  createPost,
  deletePost,
  toggleSavePost,
  checkSaveStatus,
} from "../controllers/postController.js";
import {
  getCommentsByPostId,
  createComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/saved", requireAuth, getSavedPosts);
router.post("/:id/save", requireAuth, toggleSavePost);
router.get("/:id/save/me", requireAuth, checkSaveStatus);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsByPostId);
router.post("/:id/comments", requireAuth, createComment);
router.delete("/:id", requireAuth, deletePost);

router.post("/", upload.single("image"), createPost);

export default router;
