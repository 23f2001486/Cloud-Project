// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  console.log("Token received:", req.headers.authorization);


  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload (user data)
    console.log("User decoded:", req.user);
    console.log(req.user._id);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
