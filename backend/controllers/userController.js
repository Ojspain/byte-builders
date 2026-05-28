import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import SavedPost from "../models/SavedPost.js";
import Like from "../models/Like.js";
import Notification from "../models/Notification.js";
import {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
} from "../util/validateInputs.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validationError = validateSignup({ username, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicUrl: user.profilePicUrl,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validationError = validateLogin({ username, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicUrl: user.profilePicUrl,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Server error." });
  }

  return res.status(200).json({ message: "Logged out." });
};

export const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { username: newUsername, email, bio, profilePicUrl } = req.body;

    const validationError = validateProfileUpdate({
      username: newUsername,
      email,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updates = {};
    if (newUsername !== undefined) updates.username = newUsername;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (profilePicUrl !== undefined) updates.profilePicUrl = profilePicUrl;

    const user = await User.findOneAndUpdate({ username }, updates, {
      new: true,
      runValidators: true,
      projection: { passwordHash: 0 },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }, { passwordHash: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserByUsername:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.find({ authorId: userId }, { _id: 1 });
    const userPostIds = userPosts.map((post) => post._id);

    const [authoredComments, commentsOnUserPosts] = await Promise.all([
      Comment.find({ authorId: userId }, { _id: 1 }),
      Comment.find({ postId: { $in: userPostIds } }, { _id: 1 }),
    ]);

    const commentIdSet = new Set([
      ...authoredComments.map((comment) => comment._id.toString()),
      ...commentsOnUserPosts.map((comment) => comment._id.toString()),
    ]);
    const relatedCommentIds = Array.from(commentIdSet);

    await Promise.all([
      SavedPost.deleteMany({
        $or: [{ userId }, { postId: { $in: userPostIds } }],
      }),
      Like.deleteMany({
        $or: [
          { userId },
          { targetType: "post", targetId: { $in: userPostIds } },
          { targetType: "comment", targetId: { $in: relatedCommentIds } },
        ],
      }),
      Notification.deleteMany({
        $or: [
          { recipientId: userId },
          { actorId: userId },
          { postId: { $in: userPostIds } },
          { commentId: { $in: relatedCommentIds } },
        ],
      }),
      Comment.deleteMany({
        $or: [{ authorId: userId }, { postId: { $in: userPostIds } }],
      }),
      Post.deleteMany({ authorId: userId }),
      User.findByIdAndDelete(userId),
    ]);

    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error in deleteMyAccount:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
