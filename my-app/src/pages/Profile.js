// src/services/api.js
import axios from "axios";

const BASE_URL = "https://cloud-project-yy9b.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Automatically attach JWT token from localStorage for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token attached:", config.headers.Authorization);
  } else {
    console.warn("⚠️ No token found in localStorage");
  }
  return config;
});

// === AUTH ===
export const getAuthStatus = () => api.get("/auth/me");

// === COMPLAINTS ===
export const getComplaints = () => api.get("/complaints/");
export const createComplaint = (formData) =>
  api.post("/complaints/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateComplaint = (id, data) =>
  api.put(`/complaints/edit/${id}`, data);
export const deleteComplaint = (id) => api.delete(`/complaints/delete/${id}`);
export const changeStatus = (id, status) =>
  api.put(`/complaints/edit/status/${id}`, { status });
export const addFeedback = (id, feedback) =>
  api.put(`/complaints/edit/feedback/${id}`, { feedback });

// === USERS ===
export const getUserProfile = () => api.get("/users/view");

export default api;


