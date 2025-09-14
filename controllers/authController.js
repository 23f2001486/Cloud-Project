import User from '../models/user-model.js';
import Admin from '../models/admin-model.js'; // Import your admin model

export async function googleAuthCallback(req, accessToken, refreshToken, profile, done) {
  try {
    console.log("Google Profile:", profile); // DEBUG

    // Check if the email is in the Admin collection
    const email = profile.emails?.[0]?.value || null;
    const isAdmin = await Admin.findOne({ email });

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: email,
         profilePic: profile.picture || profile.photos?.[0]?.value || null,
        role: isAdmin ? "admin" : "student", 
      });
    }

    return done(null, user);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return done(err, null);
  }
}
