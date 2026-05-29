import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";

const router = express.Router();

router.post("/:username/follow", requireAuth, followUser);
router.delete("/:username/follow", requireAuth, unfollowUser);
router.get("/:username/follow-status", requireAuth, getFollowStatus);
router.get("/:username/followers", getFollowers);
router.get("/:username/following", getFollowing);

export default router;
