import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import PostLogin from "./pages/PostLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AddComplaint from "./pages/AddComplaint"; 
import UserProfile from"./pages/Profile";
import AboutPage from "./pages/about";
import User from "./pages/adminProfile";
import AdminAnnouncement from "./pages/Adminannouncement";
import AdminAbout from "./pages/adminAbout";
import ResolvedComplaints from "./pages/resolvedComplaints";
import AddAnnouncement from "./pages/addAnnouncement";
import EditAnnouncement from "./pages/editAnnouncement";
import ViewAnnouncements from "./pages/viewAnnouncements";

import "./styles/theme.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/post-login" element={<PostLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/resolves_complaints" element={<ResolvedComplaints />} />
          <Route path="/student" element={<StudentDashboard />} />
           <Route path="/student/add-complaint" element={<AddComplaint />} />
            <Route path="/student/profile" element={<UserProfile />} />
            <Route path="/about" element={<AboutPage />}/>
            <Route path="/admin/profile" element={<User />} />
            <Route path="/admin/about" element={<AdminAbout />}/>
             <Route path="/admin/add-announcement" element={<AddAnnouncement />} />
          <Route path="/admin/edit-announcement/:id" element={<EditAnnouncement />} />

<Route path="/adminannouncement" element={<AdminAnnouncement />} />
          {/* Student Routes */}

          {/* ✅ Common View (for students + admin) */}
          <Route path="/announcements" element={<ViewAnnouncements />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
