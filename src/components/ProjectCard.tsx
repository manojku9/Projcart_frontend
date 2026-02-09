import { useState } from "react";
import type { Project } from "../types/Project";

function normalizeUrl(u?: string) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  const websiteUrl = normalizeUrl(project.website);

  const fallbackScreenshot = websiteUrl
    ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(websiteUrl)}?w=1200`
    : undefined;

  const imgSrc = project.previewImage || (!imgError ? fallbackScreenshot : undefined);

  return (
    <article className="project-card">
      {imgSrc && (
        <div className="thumb">
          <img
            src={imgSrc}
            alt={project.previewTitle || project.title}
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-creator">By {project.creatorName || project.user?.name || "Unknown"}</p>

        <div className="card-links">
          {project.website && (
            <a href={websiteUrl} target="_blank" rel="noreferrer" aria-label="Visit website">
              <span className="link-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                  <path d="M12 7v6" />
                  <path d="M12 13l-6 6" />
                  <path d="M12 13l6 6" />
                </svg>
              </span>
              <span>Website</span>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              <span className="link-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.387 7.865 10.907.575.106.785-.25.785-.556 0-.275-.01-1.007-.016-1.98-3.2.696-3.876-1.542-3.876-1.542-.523-1.33-1.277-1.684-1.277-1.684-1.044-.713.08-.699.08-.699 1.155.082 1.763 1.186 1.763 1.186 1.026 1.759 2.692 1.251 3.347.957.104-.743.402-1.251.731-1.538-2.554-.29-5.242-1.277-5.242-5.683 0-1.255.448-2.279 1.183-3.083-.119-.29-.512-1.455.112-3.034 0 0 .966-.31 3.167 1.18.918-.255 1.902-.383 2.88-.388.977.005 1.962.133 2.88.388 2.199-1.49 3.165-1.18 3.165-1.18.626 1.579.233 2.744.114 3.034.737.804 1.182 1.828 1.182 3.083 0 4.417-2.694 5.389-5.257 5.673.413.355.781 1.058.781 2.133 0 1.539-.014 2.78-.014 3.157 0 .31.21.67.792.556C20.709 21.387 24 17.084 24 12c0-6.352-5.148-11.5-12-11.5z"/></svg>
              </span>
              <span>GitHub</span>
            </a>
          )}
          {project.xProfile && (
            <a href={project.xProfile} target="_blank" rel="noreferrer">
              <span className="link-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.162 5.656c-.63.28-1.307.47-2.02.558.726-.435 1.283-1.122 1.546-1.94-.68.402-1.434.695-2.236.854C18.98 4.156 17.894 3.5 16.68 3.5c-1.997 0-3.616 1.62-3.616 3.618 0 .283.034.558.093.821-3.004-.15-5.67-1.59-7.454-3.776-.312.536-.49 1.158-.49 1.821 0 1.257.64 2.368 1.612 3.019-.594-.02-1.153-.182-1.64-.454v.046c0 1.755 1.25 3.215 2.913 3.548-.305.084-.626.129-.957.129-.233 0-.46-.022-.68-.065.46 1.436 1.795 2.48 3.376 2.51-1.236.97-2.795 1.547-4.49 1.547-.292 0-.579-.017-.863-.05 1.604 1.028 3.51 1.627 5.566 1.627 6.68 0 10.335-5.53 10.335-10.322v-.47c.708-.51 1.248-1.147 1.708-1.87-.647.29-1.345.486-2.072.574z"/></svg>
              </span>
              <span>X</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
