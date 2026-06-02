import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Notification from "../models/Notification.js";
import Post from "../models/Post.js";

const isValidTargetType = (targetType) =>
  targetType === "post" || targetType === "comment" || targetType === "speciesType";
const isValidReactionType = (reactionType) =>
  reactionType === "like" || reactionType === "spray" || reactionType === "dislike";

const fieldByReactionType = {
  like: "likeCount",
  spray: "sprayCount",
};

const getTargetByType = async (targetType, targetId) => {
  if (targetType === "post") {
    const post = await Post.findById(targetId);
    if (!post) return null;
    return {
      doc: post,
      ownerId: post.authorId,
      notificationRefs: { postId: post._id, commentId: null },
    };
  }

  if (targetType === "comment") {
    const comment = await Comment.findById(targetId);
    if (!comment) return null;
    return {
      doc: comment,
      ownerId: comment.authorId,
      notificationRefs: { postId: comment.postId, commentId: comment._id },
    };
  }

  if (targetType === "speciesType") {
    const species = await Like.findById(targetId);
    if (!species) return null;
    return {
      doc: species,
      ownerId: species.authorId,
      notificationRefs: { speciedId: species.postId, commentId: null },
    };
  }
};

const getCounts = (doc) => ({
  likeCount: doc.likeCount || 0,
  sprayCount: doc.sprayCount || 0,
});

const buildPayload = (targetType, targetId, myReaction, doc) => ({
  targetType,
  targetId,
  myReaction,
  ...getCounts(doc),
});

export const setReaction = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { targetType, targetId } = req.params;
    const { reactionType } = req.body;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!isValidTargetType(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }
    if (!isValidReactionType(reactionType)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const target = await getTargetByType(targetType, targetId);
    if (!target) {
      return res.status(404).json({ message: "Target not found" });
    }

    const existingReaction = await Like.findOne({
      userId: actorId,
      targetId,
      targetType,
    });

    if (existingReaction?.reactionType === reactionType) {
      return res.status(200).json({
        data: buildPayload(targetType, targetId, reactionType, target.doc),
      });
    }

    const targetDoc = target.doc;

    const Model = targetType === "post" ? Post : (targetType === "comment" ? Comment : Species);
    if (!existingReaction) {
      await Like.create({
        userId: actorId,
        targetId,
        targetType,
        reactionType,
      });

      await Model.updateOne(
        { _id: targetId },
        { $inc: { [fieldByReactionType[reactionType]]: 1 } },
      );

      targetDoc[fieldByReactionType[reactionType]] =
        (targetDoc[fieldByReactionType[reactionType]] || 0) + 1;
    } else {
      const previousType = existingReaction.reactionType;
      existingReaction.reactionType = reactionType;
      await existingReaction.save();
      await Model.updateOne(
        { _id: targetId },
        {
          $inc: {
            [fieldByReactionType[previousType]]: -1,
            [fieldByReactionType[reactionType]]: 1,
          },
        },
      );

      targetDoc[fieldByReactionType[previousType]] = Math.max(
        0,
        (targetDoc[fieldByReactionType[previousType]] || 0) - 1,
      );
      targetDoc[fieldByReactionType[reactionType]] =
        (targetDoc[fieldByReactionType[reactionType]] || 0) + 1;
    }

    if (String(target.ownerId) !== String(actorId)) {
      await Notification.create({
        recipientId: target.ownerId,
        actorId,
        type: reactionType,
        ...target.notificationRefs,
      });
    }

    return res.status(200).json({
      data: buildPayload(targetType, targetId, reactionType, targetDoc),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid identifier provided" });
    }
    console.error("Error in setReaction:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const removeReaction = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { targetType, targetId } = req.params;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!isValidTargetType(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    const target = await getTargetByType(targetType, targetId);
    if (!target) {
      return res.status(404).json({ message: "Target not found" });
    }

    const existingReaction = await Like.findOneAndDelete({
      userId: actorId,
      targetId,
      targetType,
    });

    if (existingReaction) {
      const targetDoc = target.doc;
      const field = fieldByReactionType[existingReaction.reactionType];
      const Model = targetType === "post" ? Post : (targetType === "comment" ? Comment : Species);
      await Model.updateOne({ _id: targetId }, { $inc: { [field]: -1 } });

      targetDoc[field] = Math.max(0, (targetDoc[field] || 0) - 1);
    }

    return res.status(200).json({
      data: buildPayload(targetType, targetId, null, target.doc),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid identifier provided" });
    }
    console.error("Error in removeReaction:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getMyReaction = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { targetType, targetId } = req.params;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!isValidTargetType(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    const reaction = await Like.findOne({
      userId: actorId,
      targetId,
      targetType,
    });

    return res.status(200).json({
      data: {
        targetType,
        targetId,
        myReaction: reaction?.reactionType || null,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid identifier provided" });
    }
    console.error("Error in getMyReaction:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
