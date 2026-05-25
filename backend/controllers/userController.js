import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
