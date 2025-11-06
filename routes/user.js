import express from "express";
import { getUserProfile } from "../controllers/user.js";
import { verifyToken } from "../middlewares/verifyToken.js"; // ✅ import JWT middleware

const router = express.Router();

// ✅ Secure user profile route
router.get("", verifyToken, getUserProfile);

export default router;

