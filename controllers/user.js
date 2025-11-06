// controllers/userController.js
import User from "../models/user-model.js";

export const getUserProfile = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user.id;
    console.log(id);// user ID from URL or from auth token

    const user = await User.findById(id).select("-__v"); // exclude __v
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.profilePic);
    res.status(200).json({user} );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};
