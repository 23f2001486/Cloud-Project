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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "category":
        if (!value) error = "Please select a category";
        break;

      case "block_name":
        if (!value.trim()) error = "Block name is required";
        else if (!/^[A-Za-z0-9\s]+$/.test(value))
          error = "Block name can only contain letters/numbers";
        break;

      case "floor":
        if (!value) error = "Floor is required";
        else if (isNaN(value)) error = "Floor must be a number";
        else if (value < 0 || value > 10)
          error = "Floor must be between 0 and 10";
        break;

      case "room_number":
        if (form.category !== "Mess") {
          if (!value.trim()) error = "Room number is required";
          else if (!/^[A-Za-z0-9\s-]+$/.test(value))
            error = "Room number can only contain letters/numbers";
        }
        break;

      case "description":
        if (!value.trim()) error = "Description is required";
        else if (value.length < 10)
          error = "Description must be at least 10 characters";
        break;

      case "image":
        if (value && value.name) {
          const allowed = ["image/jpeg", "image/png", "image/jpg"];
          if (!allowed.includes(value.type)) {
            error = "Only JPG or PNG images are allowed";
          }
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === ""; // true if valid
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all fields before submit
  let valid = true;
  Object.keys(form).forEach((key) => {
    if (!validateField(key, form[key])) valid = false;
  });

  if (!valid) return;

  setLoading(true);
  try {
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    // Add logged-in user's ID
    formData.append("user", user._id);

    await createComplaint(formData);
    navigate("/student");
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
            <small className="text-light">
              Focus on Your Studies, Leave the Rest to Us
            </small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/student">Dashboard</Link>
            <Link className="btn btn-outline-light me-2" to="/student/add-complaint">+ Add Complaint</Link>
            <Link className="btn btn-light me-2" to={`/student/profile`}>View Profile</Link>

            <Link className="btn btn-light me-2" to={`/about`}>About</Link>
          </div>
        </div>
      </header>

      <div className="container mt-4">
        <h2 className="text-primary mb-3"> Add Complaint</h2>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

          {/* Category Select */}
          <label className="fw-bold">Category <span className="text-danger">*</span></label>
          <select
            className="form-control my-2"
            name="category"
            value={form.category}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">-- Select Category --</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Mess">Mess</option>
            <option value="Cleaning">Cleaning</option>
            <option value="WiFi">WiFi</option>
            <option value="Others">Others</option>
          </select>
          {errors.category && <small className="text-danger">{errors.category}</small>}

          {/* Block Name */}
          <label className="fw-bold">Block Name <span className="text-danger">*</span></label>
          <input
            className="form-control my-2"
            name="block_name"
            value={form.block_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Block Name"
          />
          {errors.block_name && <small className="text-danger">{errors.block_name}</small>}

          {/* Floor */}
          <label className="fw-bold">Floor (0-10) <span className="text-danger">*</span></label>
          <input
            className="form-control my-2"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Floor Number"
            type="number"
            min="0"
            max="10"
          />
          {errors.floor && <small className="text-danger">{errors.floor}</small>}

          {/* Room Number */}
          <label className="fw-bold">
            Room Number {form.category === "Mess" && <span className="text-muted">(optional)</span>}
            {form.category !== "Mess" && <span className="text-danger">*</span>}
          </label>
          <input
            className="form-control my-2"
            name="room_number"
            value={form.room_number}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Room Number"
            disabled={form.category === "Mess"}
          />
          {errors.room_number && <small className="text-danger">{errors.room_number}</small>}

          {/* Description */}
          <label className="fw-bold">Description <span className="text-danger">*</span></label>
          <textarea
            className="form-control my-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Complaint Details (min 10 chars)"
          />
          {errors.description && <small className="text-danger">{errors.description}</small>}

          {/* Image */}
          <label className="fw-bold">Image (optional)</label>
          <input
            className="form-control my-2"
            type="file"
            name="image"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.image && <small className="text-danger">{errors.image}</small>}

          <button className="btn btn-primary mt-3" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <footer className="text-center mt-5 py-3">
        © {new Date().getFullYear()} Hostel Complaint Management System. All rights reserved.
      </footer>
    </div>
  );
}
