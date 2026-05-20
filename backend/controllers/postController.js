import Post from "../models/Post.js";

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find();
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
