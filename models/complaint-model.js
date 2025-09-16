// models/Complaint.js
import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  category: { type: String, required: true },         // Electricity, Plumbing, WiFi, etc.
  block_name: { type: String, required: true },       
  floor: { type: Number, required: true },
  room_number: { type: String, required: true },      
  description: { type: String, required: true },      
  image: {
  url: { type: String },       // Cloudinary URL
  public_id: { type: String }  // Cloudinary Public ID
},
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Resolved"], 
    default: "Pending" 
  },
  feedback:{
    type:String,
    enum: ["Good", "Poor", "Unsatisfactory"],
  default: null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const e = mongoose.model("Complaint", complaintSchema);
export default e;