import mongoose from "mongoose";

// Covers all in-app notification types: "like", "comment", "follow", "reply"
const notificationSchema = new mongoose.Schema(
  {
    // The user who receives the notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The user who triggered the notification
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "spray", "comment", "follow", "reply"],
      required: true,
    },
    // optional references depending on notification type
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
