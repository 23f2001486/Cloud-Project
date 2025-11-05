import axios from "axios";

// Base URL of your deployed backend
const BASE_URL = "https://cloud-project-yy9b.onrender.com"; // ✅ Render backend URL

// Configure axios instance
const api = axios.create({
  baseURL: `${BASE_URL}`, // most backend routes are usually under /api
  withCredentials: true,
});

// ==============================
// 🔐 AUTH ENDPOINTS
// ==============================
export const login = (email, password) =>
  api.post(`/auth/google`, { email, password });

export const logout = () => api.post(`/auth/google/logout`);
export const getAuthStatus = () => api.get(`/auth/me`);

// ==============================
// 🧾 COMPLAINT ENDPOINTS
// ==============================
export const getComplaints = () => api.get(`/complaints/`);

export const createComplaint = (formData) =>
  api.post(`/complaints/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateComplaint = (id, data) =>
  api.put(`/complaints/edit/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

export const deleteComplaint = (id) => api.delete(`/complaints/delete/${id}`);

export const changeStatus = (id, status) =>
  api.put(`/complaints/edit/status/${id}`, { status });

export const addFeedback = (id, feedback) =>
  api.put(`/complaints/edit/feedback/${id}`, { feedback });

// ==============================
// 👤 USER ENDPOINT
// ==============================
export const getUserProfile = (id) => api.get(`/users/${id}`);
