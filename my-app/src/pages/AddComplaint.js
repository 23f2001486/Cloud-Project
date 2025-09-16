import React, { useState } from "react";
import { createComplaint } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddComplaint() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    category: "",
    block_name: "",
    floor: "",
    room_number: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) formData.append(key, form[key]);
      }
      await createComplaint(formData);
      navigate("/student"); // ✅ redirect to dashboard
    } catch (err) {
      console.error("Error creating complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     {/* ✅ Navigation Bar */}
           <header className="navbar navbar-custom py-3">
       <div className="container-fluid d-flex justify-content-between align-items-center">
         <div>
           <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
           <small className="text-light">Focus on Your Studies, Leave the Rest to Us</small>
         </div>
         <div>
           <Link className="btn btn-light me-2" to="/student">Dashboard</Link>
           <Link className="btn btn-outline-light me-2" to="/student/add-complaint">+ Add Complaint</Link>
           <Link className="btn btn-light me-2" to={`/student/profile/${user._id}`}>View Profile</Link>
           <Link className="btn btn-light me-2" to={`/about`}>About</Link>
         </div>
       </div>
     </header>

      <div className="container mt-4">
        <h2 className="text-primary mb-3"> Add Complaint</h2>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <input
            className="form-control my-2"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <input
            className="form-control my-2"
            name="block_name"
            value={form.block_name}
            onChange={handleChange}
            placeholder="Block Name"
          />
          <input
            className="form-control my-2"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            placeholder="Floor"
            type="number"
          />
          <input
            className="form-control my-2"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            placeholder="Room Number"
          />
          <textarea
            className="form-control my-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            className="form-control my-2"
            type="file"
            name="image"
            onChange={handleChange}
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
      <footer className="text-center mt-5 py-3">
        © {new Date().getFullYear()} Hostel Complaint Management System. All
        rights reserved.
      </footer>
    </div>
  );
}
