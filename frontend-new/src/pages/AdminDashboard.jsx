import React, { useEffect, useState } from 'react'
import { getComplaints, changeStatus } from '../services/api'

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    getComplaints().then(res => setComplaints(res.data))
  }, [])

  const handleChange = async (id, status) => {
    await changeStatus(id, status)
    const res = await getComplaints()
    setComplaints(res.data)
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <ul className="list-group">
        {complaints.map(c => (
          <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
            {c.text} - {c.status}
            <div>
              <button className="btn btn-sm btn-warning mx-1" onClick={() => handleChange(c._id, 'In Progress')}>In Progress</button>
              <button className="btn btn-sm btn-success" onClick={() => handleChange(c._id, 'Resolved')}>Resolve</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}