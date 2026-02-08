import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      window.dispatchEvent(new Event("app:loading"));
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || "Login failed");
    } finally {
      window.dispatchEvent(new Event("app:loaded"));
    }
  };

  return (
    <main className="container auth-page">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleLogin}>
        Login
      </button>

      <div style={{ margin: "1.5rem 0", textAlign: "center", color: "var(--text-secondary)" }}>
        or
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <a href="http://localhost:5000/api/auth/google" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", background: "#fff", color: "#1F2937", border: "1px solid var(--border)", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Login with Google
        </a>
        <a href="http://localhost:5000/api/auth/github" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", background: "#1F2937", color: "#fff", border: "1px solid var(--border)", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", transition: "var(--transition)" }} onMouseEnter={(e) => e.currentTarget.style.background = "#2d3748"} onMouseLeave={(e) => e.currentTarget.style.background = "#1F2937"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.387 7.865 10.907.575.106.785-.25.785-.556 0-.275-.01-1.007-.016-1.98-3.2.696-3.876-1.542-3.876-1.542-.523-1.33-1.277-1.684-1.277-1.684-1.044-.713.08-.699.08-.699 1.155.082 1.763 1.186 1.763 1.186 1.026 1.759 2.692 1.251 3.347.957.104-.743.402-1.251.731-1.538-2.554-.29-5.242-1.277-5.242-5.683 0-1.255.448-2.279 1.183-3.083-.119-.29-.512-1.455.112-3.034 0 0 .966-.31 3.167 1.18.918-.255 1.902-.383 2.88-.388.977.005 1.962.133 2.88.388 2.199-1.49 3.165-1.18 3.165-1.18.626 1.579.233 2.744.114 3.034.737.804 1.182 1.828 1.182 3.083 0 4.417-2.694 5.389-5.257 5.673.413.355.781 1.058.781 2.133 0 1.539-.014 2.78-.014 3.157 0 .31.21.67.792.556C20.709 21.387 24 17.084 24 12c0-6.352-5.148-11.5-12-11.5z" fill="currentColor"/></svg>
          Login with GitHub
        </a>
      </div>

      <p style={{ marginTop: "1.5rem" }}>
        Don't have an account?{" "}
        <a href="/signup">Sign up here</a>
      </p>
    </main>
  );
}
