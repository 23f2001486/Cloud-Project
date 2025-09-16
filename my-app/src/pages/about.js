
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AboutPage() {
   const { user } = useAuth();
  return (
    <div>
    <header className="navbar navbar-custom py-3">
       <div className="container-fluid d-flex justify-content-between align-items-center">
         <div>
           <h4 className="text-white mb-0 fw-bold"> Hostel Management</h4>
           <small className="text-light">Focus on Your Studies, Leave the Rest to Us</small>
         </div>
         <div>
           <Link className="btn btn-light me-2" to="/student">Dashboard</Link>
           <Link className="btn btn-light me-2" to="/student/add-complaint">+ Add Complaint</Link>
           <Link className="btn btn-light me-2" to={`/student/profile/${user._id}`}>View Profile</Link>
           <Link className="btn btn-light me-2" to={`/about`}>About</Link>
         </div>
       </div>
     </header>
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">About Us</h1>
        <p className="text-muted fs-5">
          Welcome to the <strong>Hostel Complaint Management System</strong>.
          We make reporting, tracking, and resolving hostel issues easy,
          transparent, and reliable.
        </p>
      </div>

      {/* Mission Card */}
      <div className="card mb-5">
        <div className="card-header">Our Mission</div>
        <div className="card-body">
          <p className="card-text">
            Our goal is to provide students with a seamless way to raise hostel
            complaints and track their progress in real-time. The system ensures
            accountability and strengthens communication between students and
            hostel authorities, ultimately improving the quality of hostel life.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="bi bi-people fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Student Friendly</h5>
              <p className="card-text text-muted">
                Simple, intuitive interface designed for students of all
                backgrounds to report complaints effortlessly.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Transparency</h5>
              <p className="card-text text-muted">
                Track the progress of your complaints with clear and real-time
                updates at every stage.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="bi bi-chat-dots fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Better Communication</h5>
              <p className="card-text text-muted">
                Strengthens the connection between students and hostel
                management, reducing delays and misunderstandings.
              </p>
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
