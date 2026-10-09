import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";
import { profile } from "../data/profile";
const links = [
  "Home",
  "About",
  "Skills",
  "Coding Profiles",
  "Projects",
  "Contact",
];
const ids = ["home", "about", "skills", "coding", "projects", "contact"];
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    if (location.pathname !== "/") {
      setActive("projects");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location]);
  return (
    <header className="header">
      <div className="container nav-inner">
        <Link to="/" className="logo" aria-label="Kumar Manthan home">
          {profile.initials}<span>.</span>
        </Link>
        <nav
          className={open ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {links.map((label, i) => (
            <Link
              key={label}
              className={active === ids[i] ? "active" : ""}
              to={`/#${ids[i]}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <a
          className="button resume-button"
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={15} /> Resume
        </a>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
