import express from "express";
import { getPost, getPostById, getCommentsByPostId } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPost);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsByPostId);

export default router;
