import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// Google login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route (with session enabled)
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail', session: true }), 
  (req, res) => {
    res.json({
      auth: "Authentication_successful",
      user: req.user, // passport gives you user here
    });
  }
);

// Failure route
router.get('/auth/fail', (req, res) => {
  res.status(401).json({ auth: "Authentication_failed" });
});

export default router;
