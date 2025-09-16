import  { useEffect, useState } from "react";
import { getComplaints, changeStatus } from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div>
      <header className="navbar navbar-custom py-3">
       <div className="container-fluid d-flex justify-content-between align-items-center">
         <div>
           <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
           <small className="text-light">Focus on Your Studies, Leave the Rest to Us</small>
         </div>
         <div>
           <Link className="btn btn-light me-2" to="/admin">Dashboard</Link>
           <Link className="btn btn-light me-2" to={`/admin/profile/${user._id}`}>View Profile</Link>
           <Link className="btn btn-light me-2" to={`/admin/about`}>About</Link>
         </div>
       </div>
     </header>
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && <div className="alert alert-accent">{error}</div>}
      {message && <div className="alert alert-primary">{message}</div>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
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
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.category}</td>
                    <td>
                      {c.block_name}, Floor {c.floor}, Room {c.room_number}
                    </td>
                    <td>{c.description}</td>
                    <td>{c.image?.url && (
  <div className="my-2">
    <img
      src={c.image.url}
      alt="Complaint"
      className="img-fluid rounded"
      style={{ maxHeight: "200px", objectFit: "cover" }}
    />
  </div>
)}</td>
                    <td>
                      <span
                        className={
                          c.status === "Resolved"
                            ? "text-success fw-bold"
                            : c.status === "In Progress"
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
    <div className="d-flex flex-column">
      <button
        className="btn btn-sm btn-success"
        disabled={pendingId === c._id}
        onClick={() => handleChange(c._id, "Resolved")}
      >
        {pendingId === c._id ? "Updating..." : "Resolve"}
      </button>
    </div>
  )}

  {/* No buttons if Resolved */}
</td>

                    <td>
  {c.status === "Resolved" && c.feedback
    ? c.feedback
    : "Feedback not received yet"}
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
