import React from "react"

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Replace with your backend Google login route
    window.location.href = "http://localhost:3000/auth/google"
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="mb-4">Login</h2>
      <button className="btn btn-danger" onClick={handleGoogleLogin}>
        <i className="bi bi-google me-2"></i> Sign in with Google
      </button>
    </div>
  )
}
