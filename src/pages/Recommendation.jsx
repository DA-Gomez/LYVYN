import { useEffect, useState } from "react";
import WeatherBox from "../components/WeatherBox";
import { getRecommendation, getWeather } from "../services/api";

export default function Recommendation() {
  const [occasion, setOccasion] = useState("casual");
  const [outfit, setOutfit] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeather("Toronto");
        setWeather(data);
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
  }, []);

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");
      setFeedback("");

      const payload = {
        weather: weather?.tempCategory || "cold",
        occasion,
        listOfClothes: ["top", "bottom", "outerwear", "shoes"],
      };

      const data = await getRecommendation(payload);
      setOutfit(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not generate recommendation right now.");
      setOutfit([]);
    } finally {
      setLoading(false);
    }
  }

  const weatherBoxData = weather
    ? {
      city: weather.city,
      day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
      temp: `${weather.temperature}°C`,
      condition: weather.rawCondition,
    }
    : {
      city: "Toronto",
      day: "Loading...",
      date: "",
      temp: "--",
      condition: weatherLoading ? "Loading..." : "Unavailable",
    };

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">OUTFIT ENGINE</p>
          <h1>Recommendation</h1>
          <p>Get an outfit suggestion based on real weather and occasion.</p>
        </div>
      </div>

      <div className="recommend-layout">
        <WeatherBox weather={weatherBoxData} />

        <div className="form-card">
          <label>
            Occasion
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </label>

          <button className="primary-btn" onClick={handleGenerate} disabled={loading || weatherLoading}>
            {loading ? "Generating..." : "Generate Outfit"}
          </button>
        </div>
      </div>

      <div className="recommendation-result-card">
        <div className="panel-header">
          <span>Suggested Outfit</span>
          <span className="mini-soft">
            {weather ? `${weather.tempCategory} / ${occasion}` : occasion}
          </span>
        </div>

        {error && <p className="info-text">{error}</p>}

        {!error && !loading && outfit.length === 0 ? (
          <div className="empty-state">
            <p>No outfit generated yet.</p>
            <p className="info-text">
              Pick an occasion and generate a recommendation.
            </p>
          </div>
        ) : null}

        {outfit.length > 0 && (
          <div className="outfit-visual-grid">
            {outfit.map((item, index) => (
              <div key={item.id || index} className="outfit-box">
                <span className="mini-label">{item.category}</span>
                <h4>{item.type}</h4>
                <p className="info-text">
                  {item.warmth} • {item.formality} • {item.colorGroup}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="feedback-row">
          <button className="secondary-btn" onClick={() => setFeedback("Liked!")}>
            Like
          </button>
          <button className="secondary-btn" onClick={() => setFeedback("Disliked!")}>
            Dislike
          </button>
        </div>

        {feedback && <p className="info-text">{feedback}</p>}
      </div>
    </section>
  );
}