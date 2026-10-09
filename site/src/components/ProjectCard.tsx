import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Map, ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";
export function ProjectVisual({ project }: { project: Project }) {
  const Icon =
    project.kind === "posture"
      ? Activity
      : project.kind === "integrity"
        ? ShieldCheck
        : Map;
  return (
    <div className={`project-visual ${project.kind}`} aria-hidden="true">
      <div className="visual-symbol">
        <Icon size={42} strokeWidth={1} />
      </div>
      <div className="visual-pipeline">
        {project.kind === "posture" ? (
          <>
            <span>IMU</span>
            <i />
            <span>CALIBRATE</span>
            <i />
            <span>ADAPT</span>
          </>
        ) : project.kind === "integrity" ? (
          <>
            <span>HASH</span>
            <i />
            <span>SIGN</span>
            <i />
            <span>VERIFY</span>
          </>
        ) : (
          <>
            <span>DISCOVER</span>
            <i />
            <span>RESERVE</span>
            <i />
            <span>REVIEW</span>
          </>
        )}
      </div>
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link to={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
        <ProjectVisual project={project} />
      </Link>
      <div className="project-card-content">
        <h3>
          <Link to={`/projects/${project.slug}`}>{project.name}</Link>
        </h3>
        <div className="project-category">{project.category}</div>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link className="project-link" to={`/projects/${project.slug}`}>
          Explore Project <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
