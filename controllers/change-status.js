// controllers/complaintController.js
import Complaint from "../models/complaint-model.js";
import nodemailer from "nodemailer";

 const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;   // Complaint ID
    const { status } = req.body; // New status

    // Update complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate("user"); // ✅ populate user to get email

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // ✅ If complaint resolved, send mail
    if (status === "Resolved") {
      const userEmail = updatedComplaint.user.email; // assuming User model has email field

      // Nodemailer transporter (use Gmail)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER, // your Gmail
          pass: process.env.GMAIL_PASS  // app password (not your real password!)
        }
      });

      // Mail content
      const mailOptions = {
        from: `"Hostel Complaints" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Your Complaint has been Resolved ✅",
        text: `Hello ${updatedComplaint.user.name},\n\nYour complaint regarding "${updatedComplaint.category}" has been resolved.\n\nThank you for your patience.\n\n- Hostel Team`
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Mail sent to", userEmail);
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