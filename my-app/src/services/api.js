import axios from 'axios';

// Configure axios to send cookies for session management
axios.defaults.withCredentials = true;


// Authentication Endpoints
export const login = (email, password) => axios.post(`/auth/google`, { email, password });
export const logout = () => axios.post(`auth/google/logout`);
export const getAuthStatus = () => axios.get(`/auth/me`);

// Complaint Endpoints
export const getComplaints = () => axios.get(`/complaints/`);
export const createComplaint = (formData) => axios.post(`/complaints/create`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateComplaint = (id, formData) => axios.put(`/complaints/edit/${id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteComplaint = (id) => axios.delete(`/complaints/delete/${id}`);

// Added for changing complaint status
export const changeStatus = (id, status) => axios.put(`/complaints/edit/status/${id}`, { status });
export const addFeedback = (id, feedback) => axios.put(`/complaints/edit/feedback/${id}`, { feedback });
// Get user profile by ID
export const getUserProfile = (id) => axios.get(`/users/${id}`);
