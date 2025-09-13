import "./config/env.js";
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';
import passport from './config/passport.js';
import complaintRoutes from "./routes/complaint.js";
import authRoutes from "./routes/auth.js"
//import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.listen(3000,()=> {
    console.log("Started the application!.")
});
/*app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true               // allow cookies to be sent
}));*/
mongoose.connect("mongodb+srv://divya:divya%402006@cluster0.wcjrfzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
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

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-app', 'build', 'index.html'));
});
