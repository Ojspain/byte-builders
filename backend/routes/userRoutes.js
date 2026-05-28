import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  updateUser,
  getUserByUsername,
  deleteMyAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/me", requireAuth, deleteMyAccount);
router.put("/:username", updateUser);
router.get("/:username", getUserByUsername);

export default router;
