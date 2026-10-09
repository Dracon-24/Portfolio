import { Github, Linkedin, Code2, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { codingProfiles } from "../data/codingProfiles";
export function SocialLinks() {
  return (
    <div className="social-links">
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        <Github size={19} />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <Linkedin size={19} />
      </a>
      <a
        href={codingProfiles[0].url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LeetCode"
      >
        <Code2 size={21} />
      </a>
      <a href={`mailto:${profile.email}`} aria-label="Email Kumar Manthan">
        <Mail size={19} />
      </a>
      <span>Find me on the web</span>
    </div>
  );
}
