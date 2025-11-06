import React, { useEffect, useState } from "react";
import {
  getComplaints,
  addFeedback,
  deleteComplaint,
  updateComplaint,
} from "../services/api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user: authUser } = useAuth(); // logged-in user
  const { id: paramId } = useParams(); // optional URL param
  const userId = paramId && paramId !== "undefined" ? paramId : authUser?._id;

  const [complaints, setComplaints] = useState([]);
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState("");
  const [editingComplaintId, setEditingComplaintId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [weather, setWeather] = useState(null);

  const navigate = useNavigate();

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "afe7cd29cf3bf7439c88320471e2d8bb";
        const city = "Vellore";
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };
    fetchWeather();
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    if (!userId) return;
    try {
      const res = await getComplaints(userId); // pass userId if your API supports it
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  // Feedback
  const handleFeedbackSave = async (id) => {
    try {
      await addFeedback(id, feedbackValue);
      setEditingFeedbackId(null);
      setFeedbackValue("");
      fetchComplaints();
    } catch (err) {
      console.error("Error adding feedback:", err);
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  // Edit complaint
  const handleEditComplaint = (complaint) => {
    setEditingComplaintId(complaint._id);
    setEditForm({
      category: complaint.category,
      description: complaint.description,
      block_name: complaint.block_name,
      floor: complaint.floor,
      room_number: complaint.room_number,
      status: complaint.status,
    });
  };

  const handleSaveComplaint = async (id) => {
    try {
      await updateComplaint(id, editForm);
      setEditingComplaintId(null);
      fetchComplaints();
    } catch (err) {
      console.error("Error updating complaint:", err);
    }
  };

  if (!authUser) {
    navigate("/login"); // redirect if not logged in
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      {/* Navbar */}
      <header className="navbar navbar-custom py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-white mb-0 fw-bold">Hostel Management</h4>
            <small className="text-light">
              Focus on Your Studies, Leave the Rest to Us
            </small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/student">
              Dashboard
            </Link>
            <Link className="btn btn-outline-light me-2" to="/student/add-complaint">
              + Add Complaint
            </Link>
            <Link
              className="btn btn-light me-2"
              to={`/student/profile`}
            >
              View Profile
            </Link>
            <Link className="btn btn-light me-2" to="/login">
              Log Out
            </Link>
            <Link className="btn btn-light me-2" to="/about">
              About
            </Link>
          </div>
        </div>
      </header>

      {/* Weather Widget */}
      {weather && (
        <div className="container mt-3">
          <div className="alert alert-warning shadow-sm d-flex justify-content-between align-items-center rounded-3">
            <div>
              <h6 className="mb-1 fw-bold">
                {weather.name} Weather: {weather.weather[0].main}
              </h6>
              <small>
                Temp: {weather.main.temp}°C | Feels like: {weather.main.feels_like}°C
              </small>
              <br />
              <strong>
                {weather.weather[0].main.toLowerCase().includes("rain")
                  ? " It’s raining — don’t leave your clothes outside!"
                  : weather.weather[0].main.toLowerCase().includes("clear")
                  ? " It's sunny — perfect day to dry your clothes!"
                  : " Keep an eye on the weather before leaving your laundry!"}
              </strong>
            </div>
            <img
              alt="weather icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              style={{ width: "70px", height: "70px" }}
            />
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="container mt-4">
        <h2 className="text-primary mb-3">All Complaints</h2>
        {complaints.length === 0 ? (
          <div className="alert alert-info">No complaints found.</div>
        ) : (
          <div className="row">
            {complaints.map((c) => (
              <div className="col-md-6 mb-3" key={c._id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    {/* ...existing complaint UI, edit form, feedback, etc. */}
                    <h5 className="card-title text-primary">{c.category}</h5>
                    <p className="card-text">{c.description}</p>
                    <p className="text-muted">
                      Block {c.block_name}, Floor {c.floor}, Room {c.room_number}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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

