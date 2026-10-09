import {
  GraduationCap,
  Terminal,
  Braces,
  Layout,
  BookOpen,
  Wrench,
  Lightbulb,
  ArrowUpRight,
  Mail,
  Palette,
  Feather,
  Download,
  Linkedin,
  Github,
  CircleDot,
  Pencil,
  Music,
} from "lucide-react";
import { Hero } from "../components/Hero";
import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { CodingProfileCard } from "../components/CodingProfileCard";
import { projects } from "../data/projects";
import { codingProfiles } from "../data/codingProfiles";
import { profile, leadership, hobbies } from "../data/profile";
import { skillGroups } from "../data/skills";
const hobbyIcons = [CircleDot, CircleDot, Braces, Pencil, Feather, Music];
import { useCodingStats } from "../context/CodingStatsContext";
const skillIcons = [Braces, Terminal, Layout, BookOpen, Wrench, Lightbulb];
export function Home() {
  const codingState = useCodingStats();
  return (
    <main>
      <Hero />
      <section id="about" className="section container about-section">
        <div>
          <SectionHeading
            index="01"
            label="A LITTLE ABOUT ME"
            title="Curiosity is the Starting Point."
          />
          <p className="about-intro">
            I'm an aspiring <span>Developer</span> and <span>Thinker</span>{" "}
            pursuing <span>B.Tech</span> in Computer Science and Engineering
            with specialization in Artificial Intelligence and Machine Learning{" "}
            <span>(CSE AIML)</span> at <span>VIT Chennai</span>.
          </p>
          <p className="about-intro">
            <span>Problems</span> are not culprits, they are opportunities and
            <span> Problem Solving</span> is what drives my day and keeps my
            coffee brewing.
          </p>
          <p className="section-copy">
            <div>Core Fundamentals get me starterd</div>
            <div>Algorithmic problem solving keeps me sharp</div>
            <div>
              Practical Projects give those fundamentals a place to matter.
            </div>
          </p>
          <div className="about-interests">
            <span>DSA</span>
            <span>Development</span>
            <span>Embedded Systems</span>
            <span>Machine Learning</span>
          </div>
        </div>
        <div className="education-card">
          <div className="education-icon">
            <GraduationCap size={24} />
          </div>
          <span className="overline">EDUCATION</span>
          <h3>{profile.college}</h3>
          <p>{profile.education}</p>
          <div className="education-stats">
            <div>
              <span>Expected graduation</span>
              <strong>{profile.graduation}</strong>
            </div>
            <div>
              <span>CGPA</span>
              <strong>{profile.cgpa}</strong>
            </div>
          </div>
          <a
            className="text-link"
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={15} /> View full resume
          </a>
        </div>
      </section>
      <section id="skills" className="section skills-section">
        <div className="container">
          <SectionHeading
            index="02"
            label="MY TOOLKIT"
            title="Arrows in my Quiver."
            description="They call it skills and tools, I call it my hands at work."
          />
          <div className="skills-grid">
            {skillGroups.map((g, i) => {
              const Icon = skillIcons[i];
              return (
                <article className="skill-group" key={g.title}>
                  <div className="skill-heading">
                    <Icon size={21} />
                    <h3>{g.title}</h3>
                  </div>
                  <p>{g.note}</p>
                  <div className="skill-tags">
                    {g.items.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="coding" className="section container">
        <div className="heading-row">
          <SectionHeading
            index="03"
            label="PROBLEM SOLVING, IN PRACTICE"
            title="The daily pursuit of better."
            description="This is how sweat from hardwork looks digitally."
          />
          <span className="snapshot-note">

          </span>
        </div>
        <div className="coding-grid">
          {codingProfiles.map((p) => (
            <CodingProfileCard key={p.slug} data={p} statistics={codingState.data.profiles.find(s => s.platform === p.slug)!} loading={codingState.loading} error={codingState.error} />
          ))}
        </div>
      </section>
      <section id="projects" className="section projects-section">
        <div className="container">
          <div className="heading-row">
            <SectionHeading
              index="04"
              label="MY FAVOURITE WORKS"
              title="A Solution is a Showcase of Idea and Implementation."
              description="Different projects. Different domains. The same curiosity."
            />
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              More on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="section container beyond-section">
        <div>
          <SectionHeading
            index="05"
            label="BEYOND THE TERMINAL"
            title="Beyond Code"
          />
          <p className="section-copy">
            Yeah, I breathe outside code too ;)
          </p>
          <div className="leadership-grid">
            {leadership.map((club, i) => {
              const Icon = i === 0 ? Palette : Feather;
              return (
                <article className="leadership-card" key={club.short}>
                  <Icon size={22} />
                  <div>
                    <h3>
                      {club.name} <span>({club.short})</span>
                    </h3>
                    <p>{club.role}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="offscreen">
          <span className="overline">WHEN I'M AWAY FROM THE KEYBOARD</span>
          <br/>
          <br/>
          <div className="hobby-cards">
            {hobbies.map((h, i) => {
              const Icon = hobbyIcons[i] ?? Lightbulb;
              return (
                <article className="leadership-card hobby-card" key={h}>
                  <Icon size={22} aria-hidden="true" />
                  <h3>{h}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="contact" className="section contact-section">
        <div className="container contact-layout">
          <div>
            <div className="section-label">
              <span>06</span>START A CONVERSATION
            </div>
            <h2>
              Let's <span>Connect.</span>
            </h2>
            <p>
              I'm open to interesting engineering problems, project
              collaborations, and opportunities to learn and build.
            </p>
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={18} /> Get in touch <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}>
              <span>
                <Mail size={18} />
                <span>
                  <small>EMAIL</small>
                  {profile.email}
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <Linkedin size={18} />
                <span>
                  <small>LINKEDIN</small>Let's connect professionally
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <span>
                <Github size={18} />
                <span>
                  <small>GITHUB</small>Explore the code
                </span>
              </span>
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
