import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewAnnouncements({
  account,
  connectMetaMask,
  disconnectMetaMask,
}) {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("/api/announcement/all");
        setAnnouncements(res.data.data || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  // Filter + sort announcements
  const filteredAnnouncements = announcements
    .filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.body.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div
      style={{
        background: "#fffbea",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{ background: "#3E2723" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-white" href="/">
            Hostel Complaint System
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "normal",
                color: "#c7b9b5",
              }}
            >
              Voice your issues, get them resolved
            </div>
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="nav-link text-white fw-semibold"
                  href="/dashboard"
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white fw-semibold"
                  href="/add-complaint"
                >
                  Add Complaint
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-white fw-semibold"
                  href="/view-announcements"
                >
                  Announcements
                </a>
              </li>
            </ul>

            <div className="ms-3">
              {account ? (
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-dark me-2">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={disconnectMetaMask}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={connectMetaMask}
                >
                  Connect MetaMask
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5 flex-grow-1">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h4 className="fw-bold mb-2 text-dark">
                📢 All Announcements
              </h4>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search announcements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: "250px" }}
                />
                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? "↑ Oldest" : "↓ Newest"}
                </button>
              </div>
            </div>

            {filteredAnnouncements.length === 0 ? (
              <p className="text-muted text-center">
                No announcements available.
              </p>
            ) : (
              <div className="row">
                {filteredAnnouncements.map((a) => (
                  <div key={a._id} className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100 rounded-3">
                      <div className="card-body">
                        <h5 className="fw-bold text-dark mb-2">{a.title}</h5>
                        <p
                          className="text-muted mb-3"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {a.body.length > 250
                            ? a.body.substring(0, 250) + "..."
                            : a.body}
                        </p>
                        <div className="text-end">
                          <span
                            className="badge bg-secondary"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {new Date(a.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="mt-auto text-center py-3"
        style={{ background: "#3E2723", color: "white" }}
      >
        <small>
          © {new Date().getFullYear()} Hostel Complaint System · All rights
          reserved
        </small>
      </footer>
    </div>
  );
}
