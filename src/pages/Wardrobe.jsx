import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClothingCard from "../components/ClothingCard";
import { getClothes } from "../services/api";

const dummyClothes = [
  {
    id: 1,
    category: "Top",
    type: "Grey Hoodie",
    warmth: "Medium",
    formality: "Casual",
    colorGroup: "Neutral",
  },
  {
    id: 2,
    category: "Bottom",
    type: "Black Jeans",
    warmth: "Medium",
    formality: "Casual",
    colorGroup: "Dark",
  },
  {
    id: 3,
    category: "Shoes",
    type: "White Sneakers",
    warmth: "Light",
    formality: "Casual",
    colorGroup: "Light",
  },
  {
    id: 4,
    category: "Outerwear",
    type: "Beige Coat",
    warmth: "Heavy",
    formality: "Smart Casual",
    colorGroup: "Beige",
  },
];

export default function Wardrobe() {
  const [clothes, setClothes] = useState(dummyClothes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClothes() {
      try {
        setLoading(true);
        setError("");
        const data = await getClothes();
        if (Array.isArray(data) && data.length > 0) {
          setClothes(data);
        }
      } catch {
        setError("Backend not connected yet. Showing sample wardrobe.");
      } finally {
        setLoading(false);
      }
    }

    loadClothes();
  }, []);

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">DIGITAL WARDROBE</p>
          <h1>My Wardrobe</h1>
          <p>Browse your clothing in a clean visual grid.</p>
        </div>

        <Link to="/add-item" className="primary-btn">
          Add Item
        </Link>
      </div>

      {loading && (
        <div className="style-note-box" style={{ marginBottom: '24px' }}>
          <p>Loading your digital wardrobe...</p>
        </div>
      )}
      
      {error && (
        <div className="style-note-box error-note" style={{ marginBottom: '24px' }}>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && clothes.length === 0 && (
        <div className="empty-state">
          <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Your wardrobe is empty.</p>
          <p className="info-text">Go strictly add some items using the Add Item page to get recommendations!</p>
        </div>
      )}

      <div className="wardrobe-grid">
        {clothes.map((item) => (
          <ClothingCard key={item.id || `${item.category}-${item.type}`} item={item} />
        ))}
      </div>
    </section>
  );
}