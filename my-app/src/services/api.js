import axios from "axios";

const BASE_URL = "https://cloud-project-yy9b.onrender.com"; // Render backend

const api = axios.create({
  baseURL: BASE_URL,
  // No cookies needed
});

// Auth endpoints
export const getAuthStatus = (token) =>
  api.get(`/auth/me?token=${token}`);

// Complaint endpoints
export const getComplaints = () => api.get(`/complaints/`);
export const createComplaint = (formData) =>
  api.post(`/complaints/create`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateComplaint = (id, data) =>
  api.put(`/complaints/edit/${id}`, data, { headers: { "Content-Type": "application/json" } });
export const deleteComplaint = (id) => api.delete(`/complaints/delete/${id}`);
export const changeStatus = (id, status) => api.put(`/complaints/edit/status/${id}`, { status });
export const addFeedback = (id, feedback) => api.put(`/complaints/edit/feedback/${id}`, { feedback });

// User endpoints
export const getUserProfile = (id) => api.get(`/users/${id}`);