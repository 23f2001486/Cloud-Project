import express from 'express';
import upload from '../middlewares/multer.js'
import addComplaint from '../controllers/add-complaint.js'
import editComplaint from '../controllers/edit-complaint.js';
import { deleteComplaint } from '../controllers/delete-complaint.js';
import getAllComplaints from '../controllers/get-complaints.js';
import changeStatus from '../controllers/change-status.js';
import { giveFeedback } from '../controllers/feedback-complaint.js';
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, getAllComplaints);
router.post("/create", verifyToken, upload.single("image"), addComplaint);
router.put("/edit/:id", verifyToken, upload.none(), editComplaint);
router.delete("/delete/:id", verifyToken, deleteComplaint);
router.put("/edit/status/:id", verifyToken, upload.none(), changeStatus);
router.put("/edit/feedback/:id", verifyToken, upload.none(), giveFeedback);

export default router;
