import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.put("/:commentId", requireAuth, updateComment);
router.delete("/:commentId", requireAuth, deleteComment);

export default router;
