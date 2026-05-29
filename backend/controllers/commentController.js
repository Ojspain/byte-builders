import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const getAuthorProjection = { username: 1, profilePicUrl: 1 };

const buildPopulatedComment = async (commentDoc) => {
  const author = await User.findById(commentDoc.authorId, getAuthorProjection);
  return { ...commentDoc.toObject(), author };
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id }).sort({ createdAt: 1 });

    const populated = await Promise.all(
      comments.map((comment) => buildPopulatedComment(comment)),
    );

    return res.status(200).json(populated);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    console.error("Error in getCommentsByPostId:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { commentText, parentCommentId = null } = req.body;
    const authorId = req.user?.id;

    const trimmedText = (commentText || "").trim();
    if (!trimmedText) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    if (trimmedText.length > 1000) {
      return res.status(400).json({ message: "Comment must be 1000 chars or less" });
    }

    const [post, author] = await Promise.all([
      Post.findById(postId),
      User.findById(authorId, getAuthorProjection),
    ]);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const newComment = await Comment.create({
      postId,
      authorId,
      parentCommentId,
      commentText: trimmedText,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    return res.status(201).json({
      comment: { ...newComment.toObject(), author },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid identifier provided" });
    }
    console.error("Error in createComment:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const requesterId = req.user?.id;
    const trimmedText = (commentText || "").trim();

    if (!trimmedText) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    if (trimmedText.length > 1000) {
      return res.status(400).json({ message: "Comment must be 1000 chars or less" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId.toString() !== requesterId) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.commentText = trimmedText;
    await comment.save();

    const populatedComment = await buildPopulatedComment(comment);
    return res.status(200).json({ comment: populatedComment });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid comment id" });
    }
    console.error("Error in updateComment:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const requesterId = req.user?.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId.toString() !== requesterId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Promise.all([
      Comment.findByIdAndDelete(commentId),
      Post.findOneAndUpdate(
        { _id: comment.postId, commentCount: { $gt: 0 } },
        { $inc: { commentCount: -1 } },
      ),
      Like.deleteMany({ targetType: "comment", targetId: commentId }),
      Notification.deleteMany({ commentId }),
    ]);

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid comment id" });
    }
    console.error("Error in deleteComment:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
