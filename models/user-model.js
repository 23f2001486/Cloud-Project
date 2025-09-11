import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  profilePic: String,
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, 
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;