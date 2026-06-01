export default function WeatherBox({ weather, loading, error }) {
  if (loading) {
    return (
      <div className="weather-box">
        <p className="mini-label">LIVE CONTEXT</p>
        <h3>Loading weather…</h3>
        <p className="info-text">Fetching real-time conditions.</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-box">
        <p className="mini-label">LIVE CONTEXT</p>
        <h3>Weather unavailable</h3>
        <p className="info-text">{error || "No weather data to show."}</p>
      </div>
    );
  }

  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: "long" });
  const date = now.toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <div className="weather-box">
      <span className="mini-label">LIVE CONTEXT</span>
      <h3>{day}, {date}</h3>
      <p><strong>City:</strong> {weather.city}</p>
      <p><strong>Temperature:</strong> {Math.round(weather.temperature)}°C</p>
      {weather.feelsLike != null && (
        <p><strong>Feels like:</strong> {Math.round(weather.feelsLike)}°C</p>
      )}
      <p><strong>Condition:</strong> {weather.rawCondition}</p>
    </div>
  );
}
