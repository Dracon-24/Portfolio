import { Link } from "react-router-dom";
import { profile } from "../data/profile";
export function Footer() {
  return (
    <footer className="container footer">
      <Link to="/" className="logo">
        {profile.initials}<span>.</span>
      </Link>
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <div>
        <Link to="/#projects">Projects</Link>
        <Link to="/#contact">Contact</Link>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
      <p>Thoughtfully built. Always evolving.</p>
    </footer>
  );
}
