import express from "express";
import { getUserProfile } from "../controllers/user.js";

const router = express.Router();

// GET user profile by ID
router.get("/:id", getUserProfile);

export default router;
