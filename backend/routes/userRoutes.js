import express from "express";
import {
  getUser,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Map the GET request at the root (/api/user) to the getuser controller
router.get("/", getUser);

// Map the GET request with an ID parameter to the getuserById controller
router.get("/:id", getUserById);

export default router;
