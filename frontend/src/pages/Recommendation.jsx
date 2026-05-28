import { useState } from "react";
import WeatherBox from "../components/WeatherBox";
import { getRecommendation, submitFeedback } from "../services/api";
import { useWeather } from "../context/useWeather";

export default function Recommendation() {
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();

  const [occasion, setOccasion] = useState("casual");
  const [outfit, setOutfit] = useState(null); // recommendedOutfit object from backend
  const [reasoning, setReasoning] = useState([]);
  const [confidence, setConfidence] = useState(null); // ML confidence score (0-1)
  const [feedback, setFeedback] = useState(""); // status message after liking/disliking
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // The backend's /weather returns one of "cold" / "mild" / "hot", and
  // /recommend accepts the same three values - so we pass it straight through.
  const weatherCategory = weather ? weather.tempCategory : null;

  async function handleGenerate() {
    if (!weather) {
      setError("Weather data isn't loaded yet. Please wait a moment and try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFeedback("");
      setHasGenerated(true);
      setOutfit(null);
      setReasoning([]);
      setConfidence(null);

      // backend hard-set rule: it expects weatherCategory, occasion, and listOfClothes
      const payload = {
        weatherCategory,
        occasion,
        listOfClothes: ["top", "bottom", "outerwear", "shoes"],
      };

      const data = await getRecommendation(payload);

      // backend returns { recommendedOutfit, confidenceScore, reasoning }
      setOutfit(data.recommendedOutfit || null);
      setReasoning(Array.isArray(data.reasoning) ? data.reasoning : []);
      setConfidence(typeof data.confidenceScore === "number" ? data.confidenceScore : null);
    } catch {
      setError("Could not generate an outfit. Make sure the backend API is running and your wardrobe has items.");
      setOutfit(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(liked) {
    if (!outfit) return;

    try {
      setFeedback(liked ? "Saving your like…" : "Saving your dislike…");

      await submitFeedback({
        liked,
        id: outfit.outfit_id || null,
        weather: weatherCategory,
        occasion,
      });

      setFeedback(liked ? "Thanks! Glad you liked it." : "Got it - we'll adjust future picks.");
    } catch {
      setFeedback("Couldn't save your feedback. Please try again.");
    }
  }

  const topItem = outfit?.top;
  const bottomItem = outfit?.bottom;
  const shoesItem = outfit?.shoes;
  const outerwearItem = outfit?.outerwear;

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
        <WeatherBox weather={weather} loading={weatherLoading} error={weatherError} />

        <div className="form-card">
          <label>
            Occasion
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </label>

          <button
            className="primary-btn"
            onClick={handleGenerate}
            disabled={loading || weatherLoading}
            style={{ width: "100%", marginTop: "auto" }}
          >
            {loading ? "Generating..." : "Generate Outfit"}
          </button>
        </div>
      </div>

      <div className="recommendation-result-card">
        <div className="panel-header">
          <span>Suggested Outfit</span>
          <span className="mini-soft">
            {weatherCategory ? `${weatherCategory} / ${occasion}` : occasion}
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

        {!error && !loading && hasGenerated && !outfit && (
          <div className="empty-state">
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No matching outfit found.</p>
            <p className="info-text">
              We couldn't find a complete outfit for a {weatherCategory} day and a {occasion} occasion. Try adding more items to your wardrobe!
            </p>
          </div>
        )}

        {outfit && (
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

            {reasoning.length > 0 && (
              <div className="style-note-box">
                <span className="mini-label">WHY THIS OUTFIT</span>
                <ul className="reasoning-list">
                  {reasoning.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
                {confidence != null && (
                  <p className="confidence-text">
                    Match confidence: {Math.round(confidence * 100)}%
                  </p>
                )}
              </div>
            )}

            <div className="feedback-row">
              <button className="secondary-btn" onClick={() => handleFeedback(true)}>
                Like
              </button>
              <button className="secondary-btn" onClick={() => handleFeedback(false)}>
                Dislike
              </button>
            </div>

            {feedback && <p className="info-text">{feedback}</p>}
          </>
        )}
      </div>
    </section>
  );
}
