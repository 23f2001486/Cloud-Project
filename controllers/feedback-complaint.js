import Complaint from '../models/complaint-model.js';

export const giveFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const complaintId = req.params.id; // Get from URL

    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { feedback, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Feedback updated successfully",
      complaint: updatedComplaint
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating feedback" });
  }
};
 export default giveFeedback;