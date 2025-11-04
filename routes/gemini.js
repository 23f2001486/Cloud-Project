import express from "express";
import {  getComplaintsBySensitivity } from "../controllers/gemini.js";


const router = express.Router();

router.get("/gemini",  getComplaintsBySensitivity);

export default router;
