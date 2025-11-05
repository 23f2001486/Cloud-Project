import React from "react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "https://cloud-project-yy9b.onrender.com/auth/google";
  };

  return (
    <div className="d-flex vh-100">
      {/* Left Branding Section */}
      <div
        className="d-flex flex-column justify-content-center p-5"
        style={{ flex: 1, backgroundColor: "#002b5c", color: "white" }}
      >
        <h1 className="fw-bold mb-3">Hostel Management</h1>
        <p className="fs-5 text-light">
         Focus on Your Studies, Leave the Rest to Us
        </p>
      </div>

      {/* Right Login Section */}
      <div
        className="d-flex align-items-center justify-content-center p-5"
        style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      >
        <div className="card p-4" style={{ width: "360px" }}>
          <div className="card-body text-center">
            {/* Heading */}
            <h3 className="fw-bold mb-4 text-dark">Login to Continue</h3>

            {/* Google Login Button */}
            <button
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleLogin}
              style={{ fontWeight: "600", borderRadius: "0.5rem" }}
            >
              <i className="bi bi-google"></i> Sign in with Google
            </button>

            {/* Footer */}
            <p className="mt-4 text-muted small">
              By signing in, you agree to our{" "}
              <a href="#" className="text-decoration-none text-primary">
                Terms
              </a>{" "}
              &{" "}
              <a href="#" className="text-decoration-none text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
