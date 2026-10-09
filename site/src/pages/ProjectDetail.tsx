import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { NotFound } from "./NotFound";
export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  return (
    <main className="project-detail container">
      <Link className="text-link back-link" to="/#projects">
        <ArrowLeft size={17} /> Back to all projects
      </Link>
      <div className="detail-hero">
        <h1>
          {project.name}
          <span className="name-period">.</span>
        </h1>
        <p className="detail-category">{project.category}</p>
        <p className="detail-description">{project.description}</p>
        <div className="tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {(project.github || project.demo) && (
          <div className="detail-actions">
            {project.github && (
              <a
                className="button"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                Repository <ArrowUpRight size={15} />
              </a>
            )}
            {project.demo && (
              <a
                className="button primary"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="detail-layout">
        <aside className="detail-nav">
          <span className="overline">IN THIS PROJECT</span>
          <a href="#architecture">System architecture</a>
          {project.sections.map((s, i) => (
            <a href={`#detail-${i}`} key={s.title}>
              {s.title}
            </a>
          ))}
        </aside>
        <div className="detail-content">
          <section id="architecture" className="detail-section">
            <div className="section-label">SYSTEM DESIGN</div>
            <h2>System architecture</h2>
            <p className="section-copy">
              A high level view of the implemented workflow.
            </p>
            <ol className="architecture">
              {project.architecture.map((step, i) => (
                <li key={step.label}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          {project.sections.map((section, i) => (
            <section
              className="detail-section"
              id={`detail-${i}`}
              key={section.title}
            >
              <h2>{section.title}</h2>
              {section.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
      <section className="related">
        <div className="section-label">KEEP EXPLORING</div>
        <h2>More things I've built.</h2>
        <div className="related-grid">
          {projects
            .filter((p) => p.slug !== slug)
            .map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
