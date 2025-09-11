import Complaint from '../models/complaint-model.js';
export const editComplaint = async(req,res)=>{
    try {
    const { id } = req.params;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      req.body, // fields to update
      { new: true }
    );
    console.log("Updating complaint:", id, req.body);
    res.json({ message: "Complaint updated", complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ message: "Error updating complaint" });
  }
};
export default editComplaint;