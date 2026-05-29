import Notification from "../models/Notification.js";

// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      // Populate actorId for the profile pic and username in NotificationItem.jsx
      .populate("actorId", "username profilePicUrl")
      // Populate commentId to extract the preview text for comment notifications
      .populate("commentId", "commentText");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get the unread notification count for the sidebar badge
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      recipientId: userId,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true },
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

// Delete all notifications
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ recipientId: userId });
    res.status(200).json({ message: "All notifications deleted" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ error: "Failed to delete notifications" });
  }
};
