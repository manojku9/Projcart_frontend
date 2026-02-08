import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import type { AxiosError } from "axios";

interface User {
  name: string;
  email: string;
}

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();



  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.user);
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      console.error("Failed to fetch user", axiosErr.response?.data);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.setTimeout(() => {
        if (!user) {
          fetchUser();
        }
      }, 0);
    } else if (user) {
      window.setTimeout(() => {
        setUser(null);
      }, 0);
    }
  }, [location.pathname, user]);

  useEffect(() => {
    window.setTimeout(() => {
      setIsMobileNavOpen(false);
    }, 0);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="brand">
          <Link to="/">
            <img src="/images/logo.png" alt="Projcart logo" className="brand-logo" />
            <span className="brand-text">Projcart</span>
          </Link>
        </h1>

        <button
          className={isMobileNavOpen ? "nav-toggle is-open" : "nav-toggle"}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={isMobileNavOpen ? "nav-open" : ""}>
          {isLoggedIn ? (
            <>
              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
              
              {user && (
                <Link to="/profile" className="profile-link" aria-label="Profile">
                  <div className="profile-icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </Link>
              )}

            </>
          ) : (
            <>
              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
              <Link to="/signup" className="nav-link nav-signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
