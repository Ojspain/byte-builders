import express from "express";
import { upload } from "../config/cloudinary.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getPosts,
  getSavedPosts,
  getPostById,
  createPost,
  deletePost,
} from "../controllers/postController.js";
import {
  getCommentsByPostId,
  createComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/saved", requireAuth, getSavedPosts);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsByPostId);
router.post("/:id/comments", requireAuth, createComment);
router.delete("/:id", requireAuth, deletePost);

router.post("/", upload.single("image"), createPost);

export default router;
