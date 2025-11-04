import "./config/env.js";
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';
import passport from './config/passport.js';
import complaintRoutes from "./routes/complaint.js";
import authRoutes from "./routes/auth.js";
import UserRoutes from "./routes/user.js";
import geminiRoutes from "./routes/gemini.js";
//import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true               // allow cookies to be sent
}));*/
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Mango db connected")
}).catch(()=>{
    console.log("Whoopss")
});
app.use(session({
  secret: 'HSDD335BD',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,         // true only if using HTTPS
    httpOnly: true,        // prevents client-side JS access
    sameSite: 'lax'        // allows cross-origin GETs (use 'none' for HTTPS)
  }
}));
// Required for __dirname in ESModule context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, 'my-app', 'build')));
app.use(passport.initialize());
app.use(passport.session()); 
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
app.use("/complaints", complaintRoutes);
app.use("/auth",authRoutes);
app.use("/users",UserRoutes);
app.use("/sensitivity",geminiRoutes);
app.get('/*path', (req, res, next) => {
  const filePath = path.join(__dirname, 'my-app', 'build', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      next(err);
    }
  });
});