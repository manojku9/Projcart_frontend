import { useEffect, useState } from "react";
import API from "../services/api";
import type { Project } from "../types/Project";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState("most-viewed");
  const [searchTerm, setSearchTerm] = useState("");

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

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "most-viewed") {
      return (b.views ?? 0) - (a.views ?? 0);
    }
    if (sortBy === "past") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProjects = normalizedSearch
    ? sortedProjects.filter((project) => {
        const creator = project.creatorName || project.user?.name || "";
        const haystack = [
          project.title,
          creator,
          project.website,
          project.github,
          project.xProfile
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
    : sortedProjects;


  return (
    <main className="container page-projects">
      <div className="projects-header">
        <h2>All Projects</h2>
        <div className="projects-controls">
          <div className="projects-search">
            <label className="sr-only" htmlFor="projectsSearch">Search projects</label>
            <input
              id="projectsSearch"
              type="search"
              placeholder="Search projects"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="projects-sort">
            <label className="projects-label" htmlFor="projectsSort">Sort</label>
            <select
              id="projectsSort"
              className="projects-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="most-viewed">Most viewed</option>
              <option value="latest">Latest</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      <section className="projects-grid">
        {filteredProjects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </section>

      {!filteredProjects.length && (
        <p className="empty-state">No projects match your search.</p>
      )}
    </main>
  );
}
