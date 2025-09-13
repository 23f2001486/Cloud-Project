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
    setTimeout(() => {
      res.redirect("/post-login");
    }, 500); // 500ms delay
  }
);
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
