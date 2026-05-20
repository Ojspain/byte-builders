import express from "express";
import { signup, login, logout, updateUser, getUserByUsername } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:username", updateUser);
router.get("/:username", getUserByUsername);

export default router;
