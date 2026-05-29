import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getMyReaction,
  removeReaction,
  setReaction,
} from "../controllers/reactionController.js";

const router = express.Router();

router.put("/:targetType/:targetId", requireAuth, setReaction);
router.delete("/:targetType/:targetId", requireAuth, removeReaction);
router.get("/:targetType/:targetId/me", requireAuth, getMyReaction);

export default router;
