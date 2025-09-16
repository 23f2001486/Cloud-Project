import { useEffect, useState } from "react";
import { getComplaints } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResolvedComplaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    fetchComplaints();
  }, []);

  const resolvedComplaints = complaints
    .filter((c) => c.status === "Resolved")
    .filter((c) => {
      const keyword = search.toLowerCase();
      return (
        c.description.toLowerCase().includes(keyword) ||
        c.category.toLowerCase().includes(keyword) ||
        c.block_name.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "block") return a.block_name.localeCompare(b.block_name);
      return 0;
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
            <Link className="btn btn-light me-2" to={`/admin/about`}>About</Link>
          </div>
        </div>
      </header>

      <div className="container mt-4">
        <h2 className="mb-4">Resolved Complaints</h2>

        {error && <div className="alert alert-accent">{error}</div>}

        {/* Search + Sort */}
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          </select>
        </div>

        {resolvedComplaints.length === 0 ? (
          <p>No resolved complaints found.</p>
        ) : (
          <div className="card">
            <div className="card-header">Resolved Complaints</div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedComplaints.map((c) => (
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
                      <td>{c.feedback || "No feedback provided"}</td>
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
