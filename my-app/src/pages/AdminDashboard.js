import { useEffect, useState } from "react";
import { getComplaints, changeStatus } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // 👈 added for direct API call to /sensitivity

export default function ActiveComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // new states for search + sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const fetchComplaints = async () => {
    try {
      setError(null);
      const res = await getComplaints();
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

 const fetchComplaintsBySensitivity = async () => {
  try {
    setError(null);
    setLoading(true);
    const res = await axios.get("/sensitivity/gemini");
    setComplaints(res.data?.complaints || []);
  } catch (err) {
    console.error("Error fetching sensitivity complaints:", err);
    setError("Failed to fetch complaints by sensitivity");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (sortBy === "sensitivity") {
      fetchComplaintsBySensitivity();
    } else {
      fetchComplaints();
    }
  }, [sortBy]);

  const handleChange = async (id, status) => {
    setPendingId(id);
    try {
      const res = await changeStatus(id, status);
      setMessage(res.data.message);
      await fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    } finally {
      setPendingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // filter & sort active complaints
  const activeComplaints = complaints
    .filter((c) => c.status !== "Resolved")
    .filter(
      (c) =>
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.block_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "block") return a.block_name.localeCompare(b.block_name);
      return 0; // sensitivity sorting handled from backend
    });

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div>
      {/* Navbar */}
      <header className="navbar navbar-custom py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
            <small className="text-light">
              Focus on Your Studies, Leave the Rest to Us
            </small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/admin">
              Active Complaints
            </Link>
            <Link className="btn btn-light me-2" to="/admin/resolves_complaints">
              Resolved Complaints
            </Link>
            <Link className="btn btn-light me-2" to={`/admin/profile/${user._id}`}>
              View Profile
            </Link>
            <Link
                          className="btn btn-light me-2"
                          to={`/login`}
                        >
                          Log Out
                        </Link>
            <Link className="btn btn-light me-2" to={`/admin/about`}>
              About
            </Link>
          </div>
        </div>
      </header>

      <div className="container mt-4">
        <h2 className="mb-4">Active Complaints</h2>

        {/* Search + Sort Controls */}
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by category, block, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="category">Category</option>
            <option value="block">Block</option>
            <option value="sensitivity"> Sensitivity </option>
          </select>
        </div>

        {error && <div className="alert alert-accent">{error}</div>}
        {message && <div className="alert alert-primary">{message}</div>}

        {activeComplaints.length === 0 ? (
          <p>No active complaints found.</p>
        ) : (
          <div className="card">
            <div className="card-header">Complaints List</div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeComplaints.map((c) => (
                    <tr key={c._id}>
                      <td>{c.category}</td>
                      <td>
                        {c.block_name}, Floor {c.floor}, Room {c.room_number}
                      </td>
                      <td>{c.description}</td>
                      <td>
                        {c.image?.url && (
                          <img
                            src={c.image.url}
                            alt="Complaint"
                            className="img-fluid rounded"
                            style={{ maxHeight: "120px", objectFit: "cover" }}
                          />
                        )}
                      </td>
                      <td>
                        <span
                          className={
                            c.status === "In Progress"
                              ? "text-warning fw-bold"
                              : "text-secondary fw-bold"
                          }
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.status === "Pending" && (
                          <div className="d-flex flex-column">
                            <button
                              className="btn btn-sm btn-warning mb-2"
                              disabled={pendingId === c._id}
                              onClick={() => handleChange(c._id, "In Progress")}
                            >
                              {pendingId === c._id ? "Updating..." : "In Progress"}
                            </button>

                            <button
                              className="btn btn-sm btn-success"
                              disabled={pendingId === c._id}
                              onClick={() => handleChange(c._id, "Resolved")}
                            >
                              {pendingId === c._id ? "Updating..." : "Resolve"}
                            </button>
                          </div>
                        )}

                        {c.status === "In Progress" && (
                          <button
                            className="btn btn-sm btn-success"
                            disabled={pendingId === c._id}
                            onClick={() => handleChange(c._id, "Resolved")}
                          >
                            {pendingId === c._id ? "Updating..." : "Resolve"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-5 py-3">
        © {new Date().getFullYear()} Hostel Complaint Management System. All
        rights reserved.
      </footer>
    </div>
  );
}
