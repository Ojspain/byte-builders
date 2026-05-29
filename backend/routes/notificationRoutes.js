import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getNotifications);
router.get("/unread", getUnreadCount);
router.put("/mark-all-read", markAllAsRead);
router.put("/:notificationId/read", markAsRead);
router.delete("/clear-all", deleteAllNotifications);
export default router;
