import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // might as well add the ability to have replies, even if it ends up out of scope
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    commentText: { type: String, required: true, maxlength: 1000 },
    likeCount: { type: Number, default: 0 },
    sprayCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
