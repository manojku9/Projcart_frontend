import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [xProfile, setXProfile] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    if (!website.trim() && !github.trim()) {
      setError("At least one link (Website or GitHub) is required");
      return;
    }

    setLoading(true);
    try {
      await API.post("/projects", {
        title,
        website,
        github,
        xProfile,
      });
      setError("");
      navigate("/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-page" onClick={handleClose}>
      <div className="create-project-header">
        <h2>Create Project</h2>
        <button
          type="button"
          className="close-btn"
          onClick={handleClose}
          aria-label="Close"
          title="Close"
        >
          ×
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Project Title *</label>
        <input
          placeholder="My Awesome Project"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Website URL</label>
        <input
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>GitHub URL</label>
        <input
          placeholder="https://github.com/username/repo"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>X (Twitter) Profile</label>
        <input
          placeholder="https://x.com/username"
          value={xProfile}
          onChange={(e) => setXProfile(e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </button>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        <a href="/dashboard">← Back to Dashboard</a>
      </p>
    </main>
  );
}
