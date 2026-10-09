import { Link } from "react-router-dom";
export function NotFound() {
  return (
    <main className="container not-found">
      <span className="section-label">404 / UNCHARTED TERRITORY</span>
      <h1>A little off course.</h1>
      <p>This page doesn't exist. Let's get you back to the projects.</p>
      <Link className="button primary" to="/">
        Back to home
      </Link>
    </main>
  );
}
