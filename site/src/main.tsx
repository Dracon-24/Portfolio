import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { NotFound } from "./pages/NotFound";
import { projects } from "./data/projects";
import "./styles/global.css";
import { CodingStatsProvider } from "./context/CodingStatsContext";
function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const project = projects.find((p) => pathname === `/projects/${p.slug}`);
    const isHome = pathname === "/";
    document.title = project
      ? `${project.name} | Kumar Manthan`
      : isHome
        ? "Kumar Manthan | Developer Portfolio"
        : "Page not found | Kumar Manthan";
    const description =
      project?.description ??
      (isHome
        ? "Kumar Manthan. CSE (AI & ML) student at VIT Chennai. Explore backend engineering projects, adaptive systems, and competitive programming achievements."
        : "This page does not exist. Explore Kumar Manthan’s developer portfolio.");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <div id="main-content" tabIndex={-1}>
        <RouteEffects />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CodingStatsProvider><App /></CodingStatsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
