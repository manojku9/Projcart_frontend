import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
            <a rel="noreferrer">Manoj</a>
          </div>
        </div>
      </footer>
      <VercelAnalytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;
