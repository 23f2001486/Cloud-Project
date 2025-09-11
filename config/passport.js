import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { googleAuthCallback } from '../controllers/authController.js';
import User from '../models/user-model.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    googleAuthCallback
  )
);

// 🔑 Serialize user: store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id); // store only user.id
});

// 🔑 Deserialize user: fetch user from DB by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
