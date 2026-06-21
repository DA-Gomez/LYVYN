import { useEffect, useState } from "react";
import WeatherBox from "../components/WeatherBox";
import { getRecommendation, getWeather, sendFeedback } from "../services/api";

export default function Recommendation() {
  const [occasion, setOccasion] = useState("casual");
  const [outfit, setOutfit] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [city, setCity] = useState("Toronto");

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeather(city);
        setWeather(data);
      } catch {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    }

    loadWeather();
  }, [city]);

async function handleGenerate() {
  try {
    setLoading(true);
    setError("");
    setConfidenceScore(null);

    const payload = {
      weatherCategory: weather?.tempCategory || "cold",
      occasion,
      listOfClothes: ["top", "bottom", "outerwear", "shoes"],
    };

    const data = await getRecommendation(payload);

    setConfidenceScore(data.confidenceScore);

    const outfitObject = data.recommendedOutfit;

    if (outfitObject) {
      setOutfit(Object.values(outfitObject));
    } else {
      setOutfit([]);
      setError(data.message || "No outfit found.");
    }
  } catch {
    setError("Could not generate recommendation right now.");
    setOutfit([]);
  } finally {
    setLoading(false);
  }
}

  async function handleFeedback(liked) {
  try {
    await sendFeedback({
      liked,
      occasion,
      weather: weather?.tempCategory || null,
      city: weather?.city || null,
      condition: weather?.rawCondition || null,
      outfit,
    });

  setFeedback(liked ? "Liked!" : "Disliked!");
  } catch {
     setFeedback("Could not save feedback right now.");
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
      day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
      temp: weatherLoading ? "Loading..." : "--",
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
              City
              <select  value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      localStorage.setItem("selectedCity", e.target.value);
                      setOutfit([]);
                      setConfidenceScore(null);
                      setFeedback("");
                      setError("");
                    }}>
                <option value="Toronto">Toronto</option>
                <option value="Markham">Markham</option>
                <option value="Ottawa">Ottawa</option>
                <option value="Vancouver">Vancouver</option>
                <option value="Calgary">Calgary</option>
              </select>
            </label>

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
          {weather
            ? `${weather.tempCategory} / ${weatherBoxData.city} / ${occasion}`
            : occasion}
        </span>
        </div>

        {confidenceScore !== null && (
  <p className="info-text">
    Confidence Score: {confidenceScore}
  </p>
)}
        
  {weather && (
  <p className="info-text">
    Based on {weatherBoxData.day}, {weatherBoxData.city}, and {weatherBoxData.condition} weather.
  </p>
)}
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
             <div key={item.id || index} className="outfit-box outfit-card">
               <span className="mini-label"> {item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                <h4>{item.type}</h4>
                <div className="info-text">
                  <p>Warmth: {item.warmth}</p>
                  <p>Style: {item.formality}</p>
                  <p>Color: {item.colorGroup}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {outfit.length > 0 && (
  <div className="style-note-box">
    <h4>Why this outfit?</h4>
    <ul>
      <li>Matches {weather?.tempCategory || "current"} weather</li>
      <li>Fits a {occasion} occasion</li>
      {outfit.some(item => item.category === "outerwear") && (
        <li>Includes outerwear for comfort</li>
      )}
    </ul>
  </div>
)}

       {outfit.length > 0 && (
  <div className="feedback-row">
    <button className="secondary-btn" onClick={() => handleFeedback(true)}>
      Like
    </button>
    <button className="secondary-btn" onClick={() => handleFeedback(false)}>
      Dislike
    </button>
  </div>
)}

        {feedback && <p className="info-text">{feedback}</p>}
      </div>
    </section>
  );
}