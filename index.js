import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import passport from "./config/passport.js";
import complaintRoutes from "./routes/complaint.js";
import authRoutes from "./routes/auth.js";
import UserRoutes from "./routes/user.js";
import geminiRoutes from "./routes/gemini.js";
import announcementRouter from "./routes/announcementRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup — allow frontend
app.use(
  cors({
    origin: "https://cloud-project-olive.vercel.app", // 🔁 change to your frontend (e.g. http://localhost:5173)
    credentials: true,
  })
);

// ✅ Initialize passport (no session)
app.use(passport.initialize());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://divya:divya%402006@cluster0.wcjrfzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Required for __dirname in ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React build
app.use(express.static(path.join(__dirname, "my-app", "build")));

// Routes
app.use("/complaints", complaintRoutes);
app.use("/auth", authRoutes);
app.use("/users", UserRoutes);
app.use("/sensitivity", geminiRoutes);
app.use("/api/announcement", announcementRouter);

// Fallback route for React SPA
app.get("/*path", (req, res, next) => {
  const filePath = path.join(__dirname, "my-app", "build", "index.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      next(err);
    }
  });
});

// Start server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
