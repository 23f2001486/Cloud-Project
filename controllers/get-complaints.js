import Complaint from '../models/complaint-model.js';

export const getAllComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user && req.user.role === "admin") {
      complaints = await Complaint.find().populate("user", "name email");
    } 
    else {
      complaints = await Complaint.find({ user: req.user._id }).populate("user", "name email");
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

export default getAllComplaints;