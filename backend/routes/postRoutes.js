import express from "express";
import { upload } from "../config/cloudinary.js";
import {
  getPosts,
  getPostById,
  getCommentsByPostId,
  createPost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsByPostId);

router.post("/", upload.single("image"), createPost);

export default router;
