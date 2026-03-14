import { useState } from "react";
import WeatherBox from "../components/WeatherBox";
import { getRecommendation } from "../services/api";

const defaultWeather = {
  city: "Toronto",
  day: "Wednesday",
  date: "March 11",
  temp: "3°C",
  condition: "Snow",
};

function getWeatherCategory(tempString) {
  const numericTemp = parseInt(tempString, 10);
  if (Number.isNaN(numericTemp)) return "cold";
  return numericTemp >= 20 ? "hot" : "cold";
}

function buildStyleNote(items, occasion, weatherCategory) {
  if (!items || items.length === 0) {
    return "No matching outfit was found for the selected occasion and weather.";
  }

  const categories = items.map((item) => item.category).join(", ");
  return `This ${occasion} outfit is selected for ${weatherCategory} weather using your available wardrobe categories: ${categories}.`;
}

export default function Recommendation() {
  const [occasion, setOccasion] = useState("casual");
  const [outfit, setOutfit] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");
      setFeedback("");
      setHasGenerated(true);

      const payload = {
        weather: getWeatherCategory(defaultWeather.temp),
        occasion,
        listOfClothes: ["top", "bottom", "outerwear", "shoes"],
      };

      const data = await getRecommendation(payload);
      setOutfit(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not connect to the backend server to generate an outfit. Make sure the API is running.");
      setOutfit([]);
    } finally {
      setLoading(false);
    }
  }

  const topItem = outfit.find((item) => item.category === "top");
  const bottomItem = outfit.find((item) => item.category === "bottom");
  const shoesItem = outfit.find((item) => item.category === "shoes");
  const outerwearItem = outfit.find((item) => item.category === "outerwear");

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">OUTFIT ENGINE</p>
          <h1>Recommendation</h1>
          <p>Get an outfit suggestion based on weather and occasion.</p>
        </div>
      </div>

      <div className="recommend-layout">
        <WeatherBox weather={defaultWeather} />

        <div className="form-card">
          <label>
            Occasion
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </label>

          <button className="primary-btn" onClick={handleGenerate} disabled={loading} style={{ width: '100%', marginTop: 'auto' }}>
            {loading ? "Generating..." : "Generate Outfit"}
          </button>
        </div>
      </div>

      <div className="recommendation-result-card">
        <div className="panel-header">
          <span>Suggested Outfit</span>
          <span className="mini-soft">
            {getWeatherCategory(defaultWeather.temp)} / {occasion}
          </span>
        </div>

        {error && (
          <div className="style-note-box error-note" style={{ marginTop: '0', marginBottom: '24px' }}>
            <p>{error}</p>
          </div>
        )}

        {!error && !loading && !hasGenerated && (
          <div className="empty-state">
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Ready to dress for the weather.</p>
            <p className="info-text">
              Pick an occasion and click generate to see a personalized outfit selected from your wardrobe.
            </p>
          </div>
        )}

        {!error && !loading && hasGenerated && outfit.length === 0 && (
          <div className="empty-state">
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No matching outfit found.</p>
            <p className="info-text">
              We couldn't find a complete outfit for a {getWeatherCategory(defaultWeather.temp)} day and a {occasion} occasion. Try adding more items to your wardrobe!
            </p>
          </div>
        )}

        {outfit.length > 0 && (
          <>
            <div className="outfit-visual-grid">
              <div className="outfit-box">
                <span className="mini-label">TOP</span>
                <h4>{topItem ? topItem.type : "Not included"}</h4>
                {topItem && (
                  <p className="info-text">
                    {topItem.warmth} • {topItem.formality} • {topItem.colorGroup}
                  </p>
                )}
              </div>

              <div className="outfit-box">
                <span className="mini-label">BOTTOM</span>
                <h4>{bottomItem ? bottomItem.type : "Not included"}</h4>
                {bottomItem && (
                  <p className="info-text">
                    {bottomItem.warmth} • {bottomItem.formality} • {bottomItem.colorGroup}
                  </p>
                )}
              </div>

              <div className="outfit-box">
                <span className="mini-label">SHOES</span>
                <h4>{shoesItem ? shoesItem.type : "Not included"}</h4>
                {shoesItem && (
                  <p className="info-text">
                    {shoesItem.warmth} • {shoesItem.formality} • {shoesItem.colorGroup}
                  </p>
                )}
              </div>

              <div className="outfit-box">
                <span className="mini-label">OUTERWEAR</span>
                <h4>{outerwearItem ? outerwearItem.type : "Not included"}</h4>
                {outerwearItem && (
                  <p className="info-text">
                    {outerwearItem.warmth} • {outerwearItem.formality} • {outerwearItem.colorGroup}
                  </p>
                )}
              </div>
            </div>

            <div className="style-note-box">
              <span className="mini-label">STYLE NOTE</span>
              <p>{buildStyleNote(outfit, occasion, getWeatherCategory(defaultWeather.temp))}</p>
            </div>
          </>
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