import express from "express";
import passport from "../config/passport.js";
import { verifyJWT } from "../controllers/authController.js";

const router = express.Router();

// Step 1: Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback (return JWT)
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/fail" }),
  (req, res) => {
    const token = req.user.token;
    const frontendUrl = "https://cloud-project-olive.vercel.app/post-login";
    res.redirect(`${frontendUrl}?token=${token}`);
  }
);

// Step 3: Verify Token (for frontend PostLogin)
router.get("/me", verifyJWT, (req, res) => {
  res.json({ user: req.user });
});

// Failure route
router.get("/fail", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

export default router;
