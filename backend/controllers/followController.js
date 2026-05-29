import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

const parseLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
};

const toUserCard = (userDoc) => ({
  _id: userDoc._id,
  username: userDoc.username,
  profilePicUrl: userDoc.profilePicUrl,
  bio: userDoc.bio,
});

const getCounts = async (userId) => {
  const [followerCount, followingCount] = await Promise.all([
    Follow.countDocuments({ followeeId: userId }),
    Follow.countDocuments({ followerId: userId }),
  ]);
  return { followerCount, followingCount };
};

export const followUser = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { username } = req.params;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const targetUser = await User.findOne({ username }, { _id: 1, username: 1 });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === actorId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    let created = false;
    try {
      await Follow.create({
        followerId: actorId,
        followeeId: targetUser._id,
      });
      created = true;
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }
    }

    if (created) {
      await Notification.create({
        recipientId: targetUser._id,
        actorId,
        type: "follow",
      });
    }

    const [targetCounts, viewerCounts] = await Promise.all([
      getCounts(targetUser._id),
      getCounts(actorId),
    ]);

    return res.status(200).json({
      message: created ? "Followed user" : "Already following user",
      data: {
        targetUsername: targetUser.username,
        isFollowing: true,
        targetFollowerCount: targetCounts.followerCount,
        viewerFollowingCount: viewerCounts.followingCount,
      },
    });
  } catch (error) {
    console.error("Error in followUser:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { username } = req.params;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const targetUser = await User.findOne({ username }, { _id: 1, username: 1 });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Follow.findOneAndDelete({
      followerId: actorId,
      followeeId: targetUser._id,
    });

    const [targetCounts, viewerCounts] = await Promise.all([
      getCounts(targetUser._id),
      getCounts(actorId),
    ]);

    return res.status(200).json({
      message: "Unfollowed user",
      data: {
        targetUsername: targetUser.username,
        isFollowing: false,
        targetFollowerCount: targetCounts.followerCount,
        viewerFollowingCount: viewerCounts.followingCount,
      },
    });
  } catch (error) {
    console.error("Error in unfollowUser:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getFollowStatus = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const { username } = req.params;

    if (!actorId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const targetUser = await User.findOne({ username }, { _id: 1, username: 1 });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = Boolean(
      await Follow.exists({
        followerId: actorId,
        followeeId: targetUser._id,
      }),
    );

    return res.status(200).json({
      data: {
        targetUsername: targetUser.username,
        isFollowing,
      },
    });
  } catch (error) {
    console.error("Error in getFollowStatus:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const { cursor } = req.query;
    const limit = parseLimit(req.query.limit);

    const targetUser = await User.findOne({ username }, { _id: 1 });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = { followeeId: targetUser._id };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const follows = await Follow.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate("followerId", "username profilePicUrl bio");

    const items = follows
      .filter((follow) => follow.followerId)
      .map((follow) => ({
        _id: follow._id,
        followedAt: follow.createdAt,
        user: toUserCard(follow.followerId),
      }));

    const nextCursor = follows.length === limit ? follows.at(-1)._id : null;

    return res.status(200).json({
      data: {
        items,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error in getFollowers:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const { cursor } = req.query;
    const limit = parseLimit(req.query.limit);

    const targetUser = await User.findOne({ username }, { _id: 1 });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = { followerId: targetUser._id };
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const follows = await Follow.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate("followeeId", "username profilePicUrl bio");

    const items = follows
      .filter((follow) => follow.followeeId)
      .map((follow) => ({
        _id: follow._id,
        followedAt: follow.createdAt,
        user: toUserCard(follow.followeeId),
      }));

    const nextCursor = follows.length === limit ? follows.at(-1)._id : null;

    return res.status(200).json({
      data: {
        items,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error in getFollowing:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
