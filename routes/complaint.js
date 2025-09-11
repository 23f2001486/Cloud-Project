import express from 'express';
import upload from '../middlewares/multer.js'
import addComplaint from '../controllers/add-complaint.js'
import editComplaint from '../controllers/edit-complaint.js';
import { deleteComplaint } from '../controllers/delete-complaint.js';
import getAllComplaints from '../controllers/get-complaints.js';
import changeStatus from '../controllers/change-status.js';
import { giveFeedback } from '../controllers/feedback-complaint.js';
const router = express.Router();

router.get("/",getAllComplaints);
router.post("/create",upload.single("image"),addComplaint);
router.put("/edit/:id", upload.none(), editComplaint);
router.delete("/delete/:id",deleteComplaint);
router.put("/edit/status/:id",upload.none(), changeStatus);
router.put("/edit/feedback/:id",upload.none(),giveFeedback);
export default router;
