import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  updateUser,
  getUserByUsername,
  verifyPassword,
  deleteMyAccount,
  getUserSpeciesPreferences,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-password", requireAuth, verifyPassword);
router.delete("/me", requireAuth, deleteMyAccount);
router.put("/:username", updateUser);
router.get("/:username", getUserByUsername);
router.get("/:username/preferences", getUserSpeciesPreferences);

export default router;
