import Complaint from '../models/complaint-model.js';
import cloudinary from '../config/cloudinary.js';
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params; // Get complaint ID from URL
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Delete image from Cloudinary (if exists)
    if (complaint.image && complaint.image.public_id) {
      await cloudinary.uploader.destroy(complaint.image.public_id);
    }

    // Delete complaint from DB
    await Complaint.findByIdAndDelete(id);

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting complaint", error: error.message });
  }
};
