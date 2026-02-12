import { useEffect, useState } from "react";
import API from "../services/api";
import type { Project } from "../types/Project";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        window.dispatchEvent(new Event("app:loading"));
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch {
        setProjects([]);
      } finally {
        window.dispatchEvent(new Event("app:loaded"));
      }
    };

    fetchProjects();
  }, []);

  const popularProjects = [...projects]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 4);

  return (
    <main className="container page-home">
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-kicker">Showcase your work</p>
          <h2>Discover projects people are shipping right now.</h2>
          <p className="hero-subtitle">
            A curated feed of real-world builds, demos, and experiments from the Projcart community.
          </p>
          {!isLoggedIn && (
            <div className="hero-actions">
              <Link to="/projects" className="btn-primary hero-cta">Get Started</Link>
              <Link to="/login" className="btn-secondary hero-secondary">Submit a Project</Link>
            </div>
          )}
        </div>
        <div className="hero-metrics">
          <div className="metric-card">
            <p className="metric-label">Projects live</p>
            <p className="metric-value">{projects.length}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">New this week</p>
            <p className="metric-value">0</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Creators</p>
            <p className="metric-value">0</p>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <h3>Launch-ready profiles</h3>
          <p>Showcase your product story, links, and visuals in one polished project card.</p>
        </div>
        <div className="feature-card">
          <h3>Community discovery</h3>
          <p>Get found by builders and collaborators looking for real projects to explore.</p>
        </div>
        <div className="feature-card">
          <h3>Momentum insights</h3>
          <p>Track engagement and keep your releases in front of the right audience.</p>
        </div>
      </section>

      <section className="home-content">
        <div className="section-header">
          <div>
            <h3>Popular Projects</h3>
            <p className="section-subtitle">Most viewed and talked-about builds right now.</p>
          </div>
          <Link to="/projects" className="section-link">Browse all</Link>
        </div>

        <div className="projects-grid">
          {popularProjects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
