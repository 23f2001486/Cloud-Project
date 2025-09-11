import React, { useEffect, useState } from 'react'
import { getComplaints, createComplaint } from '../services/api'

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    getComplaints().then(res => setComplaints(res.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createComplaint({ text })
    setText('')
    const res = await getComplaints()
    setComplaints(res.data)
  }

  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <textarea className="form-control my-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter complaint"></textarea>
        <button className="btn btn-success">Submit</button>
      </form>
      <ul className="list-group mt-3">
        {complaints.map(c => (
          <li key={c._id} className="list-group-item">{c.text} - {c.status}</li>
        ))}
      </ul>
    </div>
  )
}