export default function WeatherBox({ weather }) {
  return (
    <div className="weather-box">
      <p className="mini-label">LIVE CONTEXT</p>
      <h3>{weather.day}, {weather.date}</h3>
      <p><strong>City:</strong> {weather.city}</p>
      <p><strong>Temperature:</strong> {weather.temp}</p>
      <p><strong>Condition:</strong> {weather.condition}</p>
    </div>
  );
}