import { ArrowUpRight, Terminal, MapPin } from "lucide-react";
import { profile } from "../data/profile";
import { heroMetrics } from "../data/codingStatsView";
import { useCodingStats } from "../context/CodingStatsContext";
import { SocialLinks } from "./SocialLinks";
export function Hero() {
  const {data, loading, error} = useCodingStats();
  const metrics = heroMetrics(data.profiles);
  return (
    <section id="home" className="hero container">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span/> DEVELOPER · THINKER · BUILDER
          </div>
          <p className="hello">Hi, I'm</p>
          <h1>
            Kumar  <span>
             Manthan<span className="name-period"></span>
            </span>
          </h1>
          <p className="hero-subtitle">
            Computer Science & Engineering (AI & ML)
            <br />
            <span>@ VIT Chennai</span>
          </p>
          <p className="hero-description">{profile.intro}</p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              View My Projects <ArrowUpRight size={18} />
            </a>
            <a className="button" href="#contact">
              Contact Me
            </a>
          </div>
          <SocialLinks />
        </div>
        <div className="portrait-column">
          <div className="portrait-frame">
            <div className="portrait-top">
              <Terminal size={16} />
              <span>the person behind the code</span>
              <span className="portrait-number">01</span>
            </div>
            <img
              src={profile.portrait}
              alt="Kumar Manthan wearing a dark suit and glasses"
              width="467"
              height="363"
            />
            <div className="portrait-caption">
              <div>
                <strong>Kumar Manthan</strong>
                <span>Engineering ideas into systems.</span>
              </div>
              <span className="portrait-mark">&lt;/&gt;</span>
            </div>
          </div>
          <div className="location">
            <MapPin size={14} /> Chennai, India <span>CLASS OF 2027</span>
          </div>
        </div>
      </div>
      <div className="metric-strip">
        {metrics.map((m, i) => (
          <div className="metric" key={m.label}>
            <span className="metric-index">0{i + 1}</span>
            <div>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
              <small className="metric-data-status">{loading ? "Checking…" : m.status === "fallback" ? "Initial snapshot" : error || m.status === "stale" ? "Cached · stale" : "Cached update"}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-bottom">
        <span>BUILT WITH CURIOSITY. BACKED BY CODE.</span>
        <a href="#projects">
          SCROLL TO EXPLORE <span>↓</span>
        </a>
      </div>
    </section>
  );
}
