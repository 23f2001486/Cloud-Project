import axios from 'axios'
axios.defaults.baseURL = '/api'

export const getComplaints = () => axios.get('/complaints')
export const createComplaint = (data) => axios.post('/complaints', data)
export const updateComplaint = (id, data) => axios.put(`/complaints/${id}`, data)
export const deleteComplaint = (id) => axios.delete(`/complaints/${id}`)
export const changeStatus = (id, status) => axios.patch(`/complaints/${id}/status`, { status })
