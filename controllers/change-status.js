import Complaint from '../models/complaint-model.js';
export const changeStatus = async (req,res)=>{
    try {
    const { id } = req.params;           // Complaint ID from URL
    const { status } = req.body;         // New status from request body

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },                        
      { new: true }                      
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: "Error changing status", error: error.message });
  }
};
export default changeStatus;