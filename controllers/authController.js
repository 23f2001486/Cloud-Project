import jwt from "jsonwebtoken";
import User from "../models/user-model.js";
import Admin from "../models/admin-model.js";

export async function googleAuthCallback(req, accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails?.[0]?.value || null;
    const isAdmin = await Admin.findOne({ email });

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        profilePic: profile.picture || profile.photos?.[0]?.value || null,
        role: isAdmin ? "admin" : "student",
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Attach token to user object (Passport passes this to callback route)
    user.token = token;
    return done(null, user);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return done(err, null);
  }
}

// Verify Token middleware (for /me and protected routes)
export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};
