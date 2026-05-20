import express from "express";
import {
  getPost,
  getPostById,
} from "../controllers/postController.js";

const router = express.Router();

// Map the GET request at the root (/api/post) to the getPost controller
router.get("/", getPost);

// Map the GET request with an ID parameter to the getPostById controller
router.get("/:id", getPostById);

export default router;
