import React, { useEffect, useState } from "react";
import {
  getComplaints,
  addFeedback,
  deleteComplaint,
  updateComplaint, // ✅ fixed for JSON
} from "../services/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState("");
  const [editingComplaintId, setEditingComplaintId] = useState(null);
  const [editForm, setEditForm] = useState({});
// 🌦️ Weather Widget Component (put just below <header>)
const [weather, setWeather] = useState(null);

useEffect(() => {
  const fetchWeather = async () => {
    try {
      const apiKey = "afe7cd29cf3bf7439c88320471e2d8bb"; // 🔑 Replace with your actual OpenWeatherMap key
      const city = "Vellore"; // or dynamic location
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

  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

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
      await updateComplaint(id, editForm); // ✅ send JSON directly
      setEditingComplaintId(null);
      fetchComplaints();
    } catch (err) {
      console.error("Error updating complaint:", err);
    }
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <header className="navbar navbar-custom py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
            <small className="text-light">
              Focus on Your Studies, Leave the Rest to Us
            </small>
          </div>
          <div>
            <Link className="btn btn-light me-2" to="/student">
              Dashboard
            </Link>
            <Link
              className="btn btn-outline-light me-2"
              to="/student/add-complaint"
            >
              + Add Complaint
            </Link>
            <Link
              className="btn btn-light me-2"
              to={`/student/profile/${user._id}`}
            >
              View Profile
            </Link>
            
            <Link
              className="btn btn-light me-2"
              to={`/login`}
            >
              Log Out
            </Link>
            <Link className="btn btn-light me-2" to={`/about`}>
              About
            </Link>
          </div>
        </div>
      </header>
{/* 🌤️ Weather Widget */}
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

      <div className="container mt-4">
        <h2 className="text-primary mb-3"> All Complaints</h2>

        {complaints.length === 0 ? (
          <div className="alert alert-info">No complaints found.</div>
        ) : (
          <div className="row">
            {complaints.map((c) => (
              <div className="col-md-6 mb-3" key={c._id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    {editingComplaintId === c._id ? (
                      /* ✅ Edit Form */
                      <div>
                        <div className="mb-2">
                          <label className="form-label">Category</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Block</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.block_name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                block_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Floor</label>
                          <input
                            type="number"
                            className="form-control"
                            value={editForm.floor}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                floor: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Room Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.room_number}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                room_number: e.target.value,
                              })
                            }
                          />
                        </div>

                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSaveComplaint(c._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingComplaintId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      /* ✅ Normal View */
                      <>
                        <h5 className="card-title text-primary">
                          {c.category}
                        </h5>
                        <p className="card-text">{c.description}</p>
                        <p className="text-muted">
                          Block {c.block_name}, Floor {c.floor}, Room{" "}
                          {c.room_number}
                        </p>

                        {c.image?.url && (
                          <div className="my-2">
                            <img
                              src={c.image.url}
                              alt="Complaint"
                              className="img-fluid rounded"
                              style={{
                                maxHeight: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}

                        <p>
                          <strong>Status:</strong> {c.status}
                        </p>

                        {/* Feedback Section */}
                        {editingFeedbackId === c._id ? (
                          <div className="mt-2">
                            <select
                              className="form-select w-auto d-inline"
                              value={feedbackValue}
                              onChange={(e) =>
                                setFeedbackValue(e.target.value)
                              }
                            >
                              <option value="Good">Good</option>
                              <option value="Poor">Poor</option>
                              <option value="Unsatisfactory">
                                Unsatisfactory
                              </option>
                            </select>
                            <button
                              className="btn btn-success btn-sm ms-2"
                              onClick={() => handleFeedbackSave(c._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm ms-1"
                              onClick={() => setEditingFeedbackId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <strong>Feedback:</strong> {c.feedback}
                            {c.status === "Resolved" && (
                              <button
                                className="btn btn-outline-primary btn-sm ms-2"
                                onClick={() => {
                                  setEditingFeedbackId(c._id);
                                  setFeedbackValue(c.feedback || "-");
                                }}
                              >
                                Edit Feedback
                              </button>
                            )}
                          </div>
                        )}

                        {/* Edit Complaint (only if not In Progress) */}
                        {c.status === "Pending" && (
  <>
    {/* Edit */}
    <button
      className="btn btn-outline-warning btn-sm mt-2 me-2"
      onClick={() => handleEditComplaint(c)}
    >
      Edit Complaint
    </button>

    {/* Delete */}
    <div className="mt-2">
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => handleDelete(c._id)}
      >
        Delete
      </button>
    </div>
  </>
)}

                      </>
                    )}
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
