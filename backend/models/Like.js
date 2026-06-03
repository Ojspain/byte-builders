import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The Id of either a post, comment, or species
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["post", "comment", "speciesType"], required: true },
    reactionType: { type: String, enum: ["like", "spray", "dislike"], required: true },
  },
  {
    timestamps: true,
  },
);

// 0ne reaction per user per target
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
likeSchema.index({ targetId: 1, targetType: 1 });

const Like = mongoose.model("Like", likeSchema);

export default Like;
