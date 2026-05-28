import { Link } from "react-router-dom";
import { useWeather } from "../context/useWeather";

export default function Home() {
  const { weather, loading, error } = useWeather();

  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: "long" });
  const date = now.toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <section className="home-page">
      <div className="hero-grid">
        <div className="hero-left">
          <p className="eyebrow">SMART OUTFIT RECOMMENDATION</p>
          <h1 className="hero-title">
            Dress smarter with weather-aware wardrdfobe suggestions.
          </h1>
          <p className="hero-text">
            LVYVN helps users manage their wardrobe, add clothing items, and get outfit
            recommendations based on weather, occasion, and personal feedback.
          </p>

          <div className="hero-actions">
            <Link to="/recommendation" className="primary-btn">
              Get Recommendation
            </Link>
            <Link to="/wardrobe" className="ghost-btn">
              View Wardrobe
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">Weather</span>
              <span className="stat-label">Context-aware outfits</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">Wardrobe</span>
              <span className="stat-label">Your clothes, not random looks</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">Feedback</span>
              <span className="stat-label">Learns from like / dislike</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel top-panel">
            <div className="panel-header">
              <span>Today&apos;s Context</span>
              <span className="status-dot"></span>
            </div>
            <h3>{day}, {date}</h3>

            {/* Weather panel reflects the live API data and its loading state. */}
            {loading && <p className="soft-text">Loading live weather…</p>}

            {!loading && error && (
              <p className="soft-text">Weather unavailable right now.</p>
            )}

            {!loading && !error && weather && (
              <>
                <p>{weather.city}</p>
                <div className="weather-chip-row">
                  <span className="weather-chip">{Math.round(weather.temperature)}°C</span>
                  {weather.feelsLike != null && (
                    <span className="weather-chip">
                      Feels {Math.round(weather.feelsLike)}°C
                    </span>
                  )}
                  <span className="weather-chip">{weather.rawCondition}</span>
                </div>
              </>
            )}
          </div>

          <div className="hero-panel outfit-preview">
            <div className="panel-header">
              <span>How Recommendations Work</span>
              <span className="soft-text">Weather + Occasion</span>
            </div>

            <ol className="how-it-works-steps">
              <li>Add your clothes to the wardrobe</li>
              <li>We pull in your local weather</li>
              <li>Pick an occasion and generate an outfit</li>
              <li>Like or dislike to improve future picks</li>
            </ol>

            <p className="soft-text">
              Outfits are generated from your wardrobe items, filtered by weather and occasion.
            </p>
          </div>
        </div>
      </div>

      <div className="section-grid">
        <div className="feature-card large-card">
          <p className="mini-label">HOW IT WORKS</p>
          <h2>Built around the actual project flow</h2>
          <p>
            Add your clothing, let the system factor in weather and occasion, then
            return an outfit recommendation the user can like or dislike.
          </p>
        </div>

        <div className="feature-card">
          <p className="mini-label">WARDROBE</p>
          <h3>Organize clothing items</h3>
          <p>Store clothes by category, warmth, formality, and color group.</p>
        </div>

        <div className="feature-card">
          <p className="mini-label">RECOMMENDATION</p>
          <h3>Context-based output</h3>
          <p>Show users why a look fits the day, city, temperature, and occasion.</p>
        </div>
      </div>
    </section>
  );
}