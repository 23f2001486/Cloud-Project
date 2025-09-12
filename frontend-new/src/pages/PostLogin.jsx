import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PostLogin() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          if (data.user.role === "admin") navigate("/admin")
          else navigate("/student")
        } else {
          navigate("/login")
        }
      })
  }, [])

  return <p>Loading...</p>
}
