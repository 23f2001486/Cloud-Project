import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function AdminAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch all announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setError(null);
        const res = await axios.get("/api/announcement/all"); // Your endpoint
        setAnnouncements(res.data.data || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to fetch announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Navigate to Edit page
  const handleEdit = (id) => {
    navigate(`/admin/edit-announcement/${id}`);
  };

  // Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axios.delete(`/api/announcement/delete/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      setMessage("Announcement deleted successfully");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete announcement");
    }
  };

  return (
    <div>
      {/* Navbar/Header */}
      <header className="navbar navbar-custom py-3" style={{ background: "#3E2723" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-white mb-0 fw-bold">Hostel Management</h4>
            <small className="text-light">Focus on Your Studies, Leave the Rest to Us</small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/admin">
              Active Complaints
            </Link>
            <Link className="btn btn-light me-2" to="/admin/resolves_complaints">
              Resolved Complaints
            </Link>
            <Link className="btn btn-light me-2" to="/admin/announcements">
              Announcements
            </Link>
            <Link className="btn btn-light me-2" to={`/login`}>
              Log Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Announcements</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/add-announcement")}
          >
            Add Announcement
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <div className="text-center mt-5">
            <img
              src="/empty-box.png"
              alt="No announcements"
              style={{ width: "120px", opacity: 0.5 }}
            />
            <p className="text-muted mt-3">
              No announcements available. Click "Add Announcement" to create one.
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">Announcements List</div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((ann) => (
                    <tr key={ann._id}>
                      <td>{ann.title}</td>
                      <td>{ann.body}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(ann._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(ann._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-5 py-3" style={{ background: "#3E2723", color: "white" }}>
        © {new Date().getFullYear()} Hostel Complaint Management System. All rights reserved.
      </footer>
    </div>
  );
}
