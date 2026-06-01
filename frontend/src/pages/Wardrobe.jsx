import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClothingCard from "../components/ClothingCard";
import { getClothes, updateClothingItem, deleteClothingItem } from "../services/api";

export default function Wardrobe() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClothes() {
      try {
        setLoading(true);
        setError("");
        const data = await getClothes();
        setClothes(Array.isArray(data) ? data : []);
      } catch {
        setError("Couldn't load your wardrobe. Make sure the backend API is running.");
        setClothes([]);
      } finally {
        setLoading(false);
      }
    }

    loadClothes();
  }, []);

  async function handleUpdate(id, updatedFields) {
    try {
      await updateClothingItem(id, updatedFields);
      setClothes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
      );
    } catch {
      setError("Couldn't update that item. Please try again.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteClothingItem(id);
      setClothes((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Couldn't delete that item. Please try again.");
    }
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">DIGITAL WARDROBE</p>
          <h1>My Wardrobe</h1>
          <p>Browse, edit, and remove your clothing in a clean visual grid.</p>
        </div>

        <Link to="/add-item" className="primary-btn">
          Add Item
        </Link>
      </div>

      {loading && (
        <div className="style-note-box" style={{ marginBottom: "24px" }}>
          <p>Loading your digital wardrobe...</p>
        </div>
      )}

      {error && (
        <div className="style-note-box error-note" style={{ marginBottom: "24px" }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && clothes.length === 0 && (
        <div className="empty-state">
          <p style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: "8px" }}>
            Your wardrobe is empty.
          </p>
          <p className="info-text">
            Add some items using the Add Item page to start getting recommendations!
          </p>
        </div>
      )}

      <div className="wardrobe-grid">
        {clothes.map((item) => (
          <ClothingCard
            key={item.id || `${item.category}-${item.type}`}
            item={item}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}