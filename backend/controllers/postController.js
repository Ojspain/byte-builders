import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
  try {
    const { authorId, speciesActual, speciesCommon } = req.query;
    const query = {};
    if (authorId) query.authorId = authorId;
    if (speciesActual)
      query.speciesActual = { $regex: `^${speciesActual}$`, $options: "i" };
    if (speciesCommon)
      query.speciesCommon = { $regex: `^${speciesCommon}$`, $options: "i" };

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPost:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id }).sort({ createdAt: 1 });

    const populated = await Promise.all(
      comments.map(async (comment) => {
        const author = await User.findById(comment.authorId, {
          username: 1,
          profilePicUrl: 1,
        });
        return { ...comment.toObject(), author };
      }),
    );

    res.status(200).json(populated);
  } catch (error) {
    console.error("Error in getCommentsByPostId:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newPost = new Post({
      authorId: req.body.authorId,
      authorName: req.body.authorName,
      imageUrl: req.file.path,
      speciesCommon: req.body.speciesCommon || "",
      speciesActual: req.body.speciesActual || "",
      textContent: req.body.caption || "",
      location: req.body.location || "",
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      rating: Number(req.body.rating),
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
