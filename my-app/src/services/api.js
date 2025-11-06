import axios from "axios";

const BASE_URL = "https://cloud-project-yy9b.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(config.headers);
  }
  return config;
});

// Auth endpoints
export const getAuthStatus = () => api.get("/auth/me");

// Complaint endpoints
export const getComplaints = () => api.get("/complaints/");
export const createComplaint = (formData) =>
  api.post("/complaints/create", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateComplaint = (id, data) =>
  api.put(`/complaints/edit/${id}`, data);
export const deleteComplaint = (id) => api.delete(`/complaints/delete/${id}`);
export const changeStatus = (id, status) =>
  api.put(`/complaints/edit/status/${id}`, { status });
export const addFeedback = (id, feedback) =>
  api.put(`/complaints/edit/feedback/${id}`, { feedback });

// User endpoints
export const getUserProfile = () => api.get(`/users`);

export default api;

