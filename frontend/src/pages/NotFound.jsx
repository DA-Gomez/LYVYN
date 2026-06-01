import { Link } from "react-router-dom";

// Shown by the catch-all route in App.jsx whenever the user visits a URL that doesn't match any real page.
export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-card glass-panel">
        <p className="eyebrow">PAGE NOT FOUND</p>
        <h1 className="not-found-code">404</h1>
        <h2>This page wandered off.</h2>
        <p className="page-text">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to your wardrobe.
        </p>

        <div className="hero-actions">
          <Link to="/" className="primary-btn">
            Back to Home
          </Link>
          <Link to="/wardrobe" className="ghost-btn">
            View Wardrobe
          </Link>
        </div>
      </div>
    </section>
  );
}
