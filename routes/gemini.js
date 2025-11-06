import express from "express";
import {  getComplaintsBySensitivity } from "../controllers/gemini.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/gemini", verifyToken, getComplaintsBySensitivity);

export default router;
