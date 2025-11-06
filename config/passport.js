import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { googleAuthCallback } from "../controllers/authController.js";

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

export default passport;
