import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import OAuthSuccess from "./pages/OAuthSuccess";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        document.body.classList.add("is-scrolled");
      } else {
        document.body.classList.remove("is-scrolled");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleLoading = () => setIsGlobalLoading(true);
    const handleLoaded = () => setIsGlobalLoading(false);

    window.addEventListener("app:loading", handleLoading);
    window.addEventListener("app:loaded", handleLoaded);

    return () => {
      window.removeEventListener("app:loading", handleLoading);
      window.removeEventListener("app:loaded", handleLoaded);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
      {isGlobalLoading && (
        <div className="app-loader" role="status" aria-live="polite">
          <div className="app-loader-spinner" />
          <span>Loading...</span>
        </div>
      )}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-credit">
            <span>Built by </span>
            <a href="https://x.com/manojdotdev" target="_blank" rel="noreferrer">Manoj</a>
          </div>
          <a className="footer-icon" href="https://x.com/manojdotdev" target="_blank" rel="noreferrer" aria-label="Manoj on X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M18.244 2H21l-6.75 7.72L22 22h-6.326l-4.95-6.1L5.346 22H2.5l7.266-8.31L2 2h6.49l4.49 5.63L18.244 2zm-1.106 18h1.78L7.01 4h-1.9l11.028 16z" />
            </svg>
          </a>
        </div>
      </footer>
      <VercelAnalytics />
    </BrowserRouter>
  );
}

export default App;
