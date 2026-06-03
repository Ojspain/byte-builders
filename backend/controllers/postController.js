import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import SavedPost from "../models/SavedPost.js";
import Like from "../models/Like.js";
import Notification from "../models/Notification.js";

const mapPostWithAuthorProfilePic = (postDoc) => {
  const post = postDoc.toObject();
  const populatedAuthor = post.authorId;
  return {
    ...post,
    authorId: populatedAuthor?._id || post.authorId,
    authorProfilePicUrl: populatedAuthor?.profilePicUrl || "",
  };
};

export const getPosts = async (req, res) => {
  try {
    const { authorId, speciesActual, speciesCommon } = req.query;
    const query = {};
    if (authorId) query.authorId = authorId;
    if (speciesActual)
      query.speciesActual = { $regex: `^${speciesActual}$`, $options: "i" };
    if (speciesCommon)
      query.speciesCommon = { $regex: `^${speciesCommon}$`, $options: "i" };

    const posts = await Post.find(query)
      .populate("authorId", "profilePicUrl")
      .sort({ createdAt: -1 });
    const postsWithAuthorPics = posts.map(mapPostWithAuthorProfilePic);
    res.status(200).json(postsWithAuthorPics);
  } catch (error) {
    console.error("Error in getPost:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { reactionType, speciesQuery } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let postIds = [];

    // Filter by liked or sprayed, otherwise default to explicitly Saved posts
    if (reactionType === "like" || reactionType === "spray") {
      const likeQuery = { userId, targetType: "post", reactionType };
      const savedReactions = await Like.find(likeQuery)
        .sort({ createdAt: -1 })
        .select({ targetId: 1 });
      postIds = savedReactions.map((reaction) => reaction.targetId);
    } else {
      const explicitSaves = await SavedPost.find({ userId })
        .sort({ createdAt: -1 })
        .select({ postId: 1 });
      postIds = explicitSaves.map((save) => save.postId);
    }

    if (!postIds.length) {
      return res.status(200).json([]);
    }

    const postQuery = { _id: { $in: postIds } };
    const trimmedSpecies = (speciesQuery || "").trim();
    if (trimmedSpecies) {
      postQuery.$or = [
        { speciesActual: { $regex: trimmedSpecies, $options: "i" } },
        { speciesCommon: { $regex: trimmedSpecies, $options: "i" } },
      ];
    }

    const savedPosts = await Post.find(postQuery);
    const postsById = new Map(
      savedPosts.map((post) => [post._id.toString(), post]),
    );
    const orderedPosts = postIds
      .map((postId) => postsById.get(postId.toString()))
      .filter(Boolean);

    return res.status(200).json(orderedPosts);
  } catch (error) {
    console.error("Error in getSavedPosts:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const existingSave = await SavedPost.findOne({ userId, postId });

    if (existingSave) {
      await SavedPost.findByIdAndDelete(existingSave._id);
      return res.status(200).json({ saved: false, message: "Post unsaved" });
    } else {
      const newSave = new SavedPost({ userId, postId });
      await newSave.save();
      return res.status(201).json({ saved: true, message: "Post saved" });
    }
  } catch (error) {
    console.error("Error in toggleSavePost:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const checkSaveStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) return res.status(200).json({ saved: false });

    const existingSave = await SavedPost.findOne({ userId, postId });
    return res.status(200).json({ saved: !!existingSave });
  } catch (error) {
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

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (req.body.location == "") {
      return res.status(400).json({ message: "A location is required" });
    }
    if (!req.body.rating) {
      return res.status(400).json({ message: "Rating is required" });
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
      heart: req.body.heart || false,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user?.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== requesterId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const comments = await Comment.find({ postId: id }, { _id: 1 });
    const commentIds = comments.map((comment) => comment._id);

    await Promise.all([
      Post.findByIdAndDelete(id),
      Comment.deleteMany({ postId: id }),
      SavedPost.deleteMany({ postId: id }),
      Like.deleteMany({
        $or: [
          { targetType: "post", targetId: id },
          { targetType: "comment", targetId: { $in: commentIds } },
        ],
      }),
      Notification.deleteMany({
        $or: [{ postId: id }, { commentId: { $in: commentIds } }],
      }),
    ]);

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    console.error("Error in deletePost:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
