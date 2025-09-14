import React, { useEffect, useState } from "react";
import { getComplaints, changeStatus } from "../services/api";

export default function AdminDashboard() {
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
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      {error && <p className="text-danger">{error}</p>}
      {message && <p className="text-success">{message}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ul className="list-group">
          {complaints.map((c) => (
            <li
              key={c._id}
              className="list-group-item d-flex justify-content-between align-items-start flex-column mb-2"
            >
              <div>
                <strong>Category:</strong> {c.category} <br />
                <strong>Block:</strong> {c.block_name}, Floor {c.floor}, Room{" "}
                {c.room_number} <br />
                <strong>Description:</strong> {c.description} <br />
                <strong>Status:</strong>{" "}
                <span
                  className={
                    c.status === "Resolved"
                      ? "text-success"
                      : c.status === "In Progress"
                      ? "text-warning"
                      : "text-secondary"
                  }
                >
                  {c.status}
                </span>
              </div>

              {/* Action buttons based on current status */}
              <div className="mt-2">
                {c.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-warning mx-1"
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
                  </>
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

                {/* If already resolved → no buttons */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
