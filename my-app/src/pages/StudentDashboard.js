import React, { useEffect, useState } from "react";
import { getComplaints, addFeedback, deleteComplaint } from "../services/api";
import { Link } from "react-router-dom"; // ✅ for navigation
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

 const handleFeedbackSave = async (id) => {
  try {
    await addFeedback(id, feedbackValue); // ✅ only pass the string
    setEditingFeedbackId(null);
    setFeedbackValue("");
    fetchComplaints();
  } catch (err) {
    console.error("Error adding feedback:", err);
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  return (
    <div>
      {/* ✅ Navigation Bar */}
      <header className="navbar navbar-custom py-3">
  <div className="container-fluid d-flex justify-content-between align-items-center">
    <div>
      <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
      <small className="text-light">Empowering student living, one complaint at a time</small>
    </div>
    <div>
      <Link className="btn btn-light me-2" to="/student">Dashboard</Link>
      <Link className="btn btn-outline-light me-2" to="/student/add-complaint">+ Add Complaint</Link>
      <Link className="btn btn-light me-2" to={`/student/profile/${user._id}`}>View Profile</Link>
    </div>
  </div>
</header>

      <div className="container mt-4">
        <h2 className="text-primary mb-3"> All Complaints</h2>

        {complaints.length === 0 ? (
          <div className="alert alert-info">No complaints found.</div>
        ) : (
          <div className="row">
            {complaints.map((c) => (
              <div className="col-md-6 mb-3" key={c._id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{c.category}</h5>
                    <p className="card-text">{c.description}</p>
                    <p className="text-muted">
                      Block {c.block_name}, Floor {c.floor}, Room {c.room_number}
                    </p>
                    {c.image?.url && (
  <div className="my-2">
    <img
      src={c.image.url}
      alt="Complaint"
      className="img-fluid rounded"
      style={{ maxHeight: "200px", objectFit: "cover" }}
    />
  </div>
)}

                    <p>
                      <strong>Status:</strong> {c.status}
                    </p>

                    {/* Feedback Section */}
{editingFeedbackId === c._id ? (
  <div className="mt-2">
    <select
      className="form-select w-auto d-inline"
      value={feedbackValue}
      onChange={(e) => setFeedbackValue(e.target.value)}
    >
      <option value="Good">Good</option>
      <option value="Poor">Poor</option>
      <option value="Unsatisfactory">Unsatisfactory</option>
    </select>
    <button
      className="btn btn-success btn-sm ms-2"
      onClick={() => handleFeedbackSave(c._id)}
    >
      Save
    </button>
    <button
      className="btn btn-secondary btn-sm ms-1"
      onClick={() => setEditingFeedbackId(null)}
    >
      Cancel
    </button>
  </div>
) : (
  <div className="mt-2">
    <strong>Feedback:</strong> {c.feedback}
    {/* Show Edit button only if status is Resolved */}
    {c.status === "Resolved" && (
      <button
        className="btn btn-outline-primary btn-sm ms-2"
        onClick={() => {
          setEditingFeedbackId(c._id);
          setFeedbackValue(c.feedback || "-");
        }}
      >
        Edit
      </button>
    )}
  </div>
)}

                    {/* Delete Button */}
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="container-fluid d-flex justify-content-between align-items-center">
  <div className="container">
    <small>© 2025 Hostel Management System </small>
  </div>
</footer>
    </div>
  );
}
