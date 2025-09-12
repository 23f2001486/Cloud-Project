import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// Google login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route (with session enabled)
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // If using session
    res.redirect("http://localhost:5173/post-login")
  }
)
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Failure route
router.get('/auth/fail', (req, res) => {
  res.status(401).json({ auth: "Authentication_failed" });
});

export default router;
