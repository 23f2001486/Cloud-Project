import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PostLogin() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract ?token= from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    fetch("https://cloud-project-yy9b.onrender.com/auth/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role === "admin") navigate("/admin");
          else navigate("/student");
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, setUser]);

  return <p>Loading...</p>;
}
