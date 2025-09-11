import Complaint from '../models/complaint-model.js';
import cloudinary from '../config/cloudinary.js';
import fs from "fs";

export const addComplaint = async (req,res) =>{
    try {
let result = null;

if (req.file) {
  result = await cloudinary.uploader.upload(req.file.path, {
    folder: "complaints"
  });
}

// Create complaint document
const complaint = new Complaint({
  user: req.user._id, 
  category: req.body.category,
  block_name: req.body.block_name,
  floor: req.body.floor,
  room_number: req.body.room_number,
  description: req.body.description,
  image: result
    ? { url: result.secure_url, public_id: result.public_id }
    : null // If no file uploaded
});

await complaint.save();


    await complaint.save();
    fs.unlinkSync(req.file.path);
    res.status(201).json({ message: "Complaint created", complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create complaint", error });
  }
};
 export default addComplaint;