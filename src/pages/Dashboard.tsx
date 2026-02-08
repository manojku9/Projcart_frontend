import { useEffect, useState } from "react";
import API from "../services/api";
import type { Project } from "../types/Project";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [githubInput, setGithubInput] = useState("");
  const [xProfileInput, setXProfileInput] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        window.dispatchEvent(new Event("app:loading"));
        const res = await API.get("/users/me");
        const fetchedUser = res.data.user || null;
        const projectsWithUser = (res.data.projects || []).map((p: Project) => ({
          ...p,
          user: fetchedUser ? { name: fetchedUser.name } : p.user,
        }));
        setProjects(projectsWithUser);
        setError("");
      } catch (err) {
        const axiosErr = err as AxiosError<string>;
        setError(axiosErr.response?.data || "Failed to load projects");
        navigate("/login");
      } finally {
        window.dispatchEvent(new Event("app:loaded"));
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const openDeleteModal = (id: string) => {
    setDeletingProjectId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingProjectId(null);
    setIsDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingProjectId) return;

    try {
      await API.delete(`/projects/${deletingProjectId}`);
      setProjects(projects.filter((p) => p._id !== deletingProjectId));
      setError("");
      closeDeleteModal();
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || "Failed to delete project");
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProjectId(project._id);
    setTitleInput(project.title || "");
    setWebsiteInput(project.website || "");
    setGithubInput(project.github || "");
    setXProfileInput(project.xProfile || "");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingProjectId(null);
  };

  const handleUpdate = async () => {
    if (!editingProjectId) return;
    if (!titleInput.trim()) {
      setError("Project title is required");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await API.patch(`/projects/${editingProjectId}`, {
        title: titleInput.trim(),
        website: websiteInput.trim(),
        github: githubInput.trim(),
        xProfile: xProfileInput.trim(),
      });
      setProjects((prev) =>
        prev.map((p) => (p._id === editingProjectId ? { ...p, ...res.data } : p))
      );
      setError("");
      closeEditModal();
    } catch (err) {
      const axiosErr = err as AxiosError<string>;
      setError(axiosErr.response?.data || "Failed to update project");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <main className="container page-dashboard">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title-row">
              <h3 className="sidebar-title">My Projects</h3>
              <div className="sidebar-controls">
                <span className="sidebar-count">{projects.length}</span>
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={() => setIsProjectsOpen((prev) => !prev)}
                  aria-expanded={isProjectsOpen}
                  aria-controls="dashboard-projects-list"
                >
                  {isProjectsOpen ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="sr-only">Toggle projects list</span>
                </button>
              </div>
            </div>
            {isProjectsOpen && (
              <div id="dashboard-projects-list">
                {loading && <p className="sidebar-muted">Loading list...</p>}
                {!loading && projects.length === 0 && (
                  <p className="sidebar-muted">No projects yet.</p>
                )}
                <ul className="sidebar-list">
                  {projects.map((p) => (
                    <li key={p._id} className="sidebar-item">
                      <span className="sidebar-bullet" aria-hidden />
                      <span className="sidebar-item-title">{p.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Create a Project</h3>
            <p className="sidebar-muted">Share what you are building with the community.</p>
            <button className="btn-primary sidebar-cta" onClick={() => navigate("/create")}> 
              + Create Project
            </button>
          </div>

          <div className="sidebar-section sidebar-analytics">
            <div className="sidebar-title-row">
              <h3 className="sidebar-title">Analytics</h3>
            </div>
            <button
              className="analytics-icon-btn"
              type="button"
              onClick={() => navigate("/analytics")}
              aria-label="Open analytics"
              title="View analytics"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M4 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 20V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </aside>

        <section className="dashboard-main">
          <div className="dashboard-header">
            <div>
              <h2>My Dashboard</h2>
              <p className="dashboard-subtitle">Manage your projects and keep them up to date.</p>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          {loading && <p>Loading...</p>}

          {!loading && projects.length === 0 && (
            <p className="empty-state">No projects yet. <a href="/create">Create one now!</a></p>
          )}

          <section className="projects-grid">
            {projects.map((p) => (
              <div key={p._id} className="project-card-wrap">
                <ProjectCard project={p} />
                <div className="project-actions">
                  <button className="btn-edit" onClick={() => openEditModal(p)}>Edit</button>
                  <button className="btn-delete" onClick={() => openDeleteModal(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </section>
        </section>
      </div>

      {isDeleteOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Delete Project</h3>
              <button className="modal-close" onClick={closeDeleteModal} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-warning">
              <span className="warning-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l9 16H3l9-16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              </span>
              <div>
                <p className="warning-title">This action cannot be undone.</p>
                <p className="warning-text">This will permanently delete the project and its metadata.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn-delete" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Project</h3>
              <button className="modal-close" onClick={closeEditModal} aria-label="Close">
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Project Title *</label>
              <input
                placeholder="My Awesome Project"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input
                placeholder="https://example.com"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>GitHub URL</label>
              <input
                placeholder="https://github.com/username/repo"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>X (Twitter) Profile</label>
              <input
                placeholder="https://x.com/username"
                value={xProfileInput}
                onChange={(e) => setXProfileInput(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => navigate("/login")}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate} disabled={savingEdit}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
