import "./config/env.js";
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';
import passport from './config/passport.js';
import complaintRoutes from "./routes/complaint.js";
import authRoutes from "./routes/auth.js"

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.listen(3000,()=> {
    console.log("Started the application!.")
});
mongoose.connect("mongodb+srv://divya:divya%402006@cluster0.wcjrfzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Mango db connected")
}).catch(()=>{
    console.log("Whoopss")
});
app.use(
  session({
    secret: 'HSDD335BD', // change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session()); 
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
app.use("/complaints", complaintRoutes);
app.use("/auth",authRoutes);