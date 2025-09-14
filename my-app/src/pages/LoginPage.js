import React from "react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Replace with your backend Google login route
    window.location.href = "/auth/google";
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: "360px" }}>
        <div className="card-body text-center">
          {/* App Title */}
          <h3 className="fw-bold mb-4 text-dark">Hostel Management</h3>

          {/* Login Heading */}
          <h5 className="mb-3 text-muted">Login to Continue</h5>

          {/* Google Login Button */}
          <button
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: "#db4437",
              color: "white",
              fontWeight: "600",
              borderRadius: "8px",
            }}
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google"></i> Sign in with Google
          </button>

          {/* Footer */}
          <p className="mt-4 text-muted small">
            By signing in, you agree to our <a href="#" className="text-decoration-none" style={{ color: "#002b5c" }}>Terms</a> & <a href="#" className="text-decoration-none" style={{ color: "#002b5c" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
