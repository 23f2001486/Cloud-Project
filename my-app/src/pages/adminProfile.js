import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile } from "../services/api";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return <p className="text-center mt-5 text-secondary fw-semibold">Loading profile...</p>;
  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* ✅ Navigation Bar */}
            <header className="navbar navbar-custom py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
            <small className="text-light">Focus on Your Studies, Leave the Rest to Us</small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/admin">Active Complaints</Link>
            <Link className="btn btn-light me-2" to="/admin/resolves_complaints">
              Resolved Complaints
            </Link>
            <Link className="btn btn-light me-2" to={`/admin/profile`}>View Profile</Link>
            <Link className="btn btn-light me-2" to={`/admin/about`}>About</Link>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header text-center">
                <h4 className="mb-0">👤 User Profile</h4>
              </div>
              <div className="card-body text-center p-4">
                {/* Profile Picture */}
                <img
                  src={
                    user.profilePic?.trim() ||
                    "https://lh3.googleusercontent.com/a/ACg8ocKDFQnayuy20hq9fxklbi1AqX0IxvBIvnvKRl_sc7wkkqKoig=s96-c"
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle shadow mb-3"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    border: "4px solid #002b5c",
                  }}
                />

                {/* User Info */}
                <h5 className="fw-bold text-dark mb-1">{user.name || "N/A"}</h5>
                <p className="text-muted mb-3">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>

                <div className="d-flex justify-content-center mb-3">
                  <div className="px-3 text-start">
                    <p className="mb-1">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-1 text-muted">
                      <small>
                        Account Created:{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </small>
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
      <footer className="text-center mt-5 py-3">
        © {new Date().getFullYear()} Hostel Complaint Management System. All
        rights reserved.
      </footer>
    </div>
  );
}
