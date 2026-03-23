export default function ClothingCard({ item }) {
  return (
    <div className="wardrobe-card">
      <div className="wardrobe-card-top">
        <span className="card-badge">{item.category}</span>
        <span className="card-dot"></span>
      </div>

      <h3>{item.type}</h3>

      <div className="card-meta">
        <p><strong>Warmth:</strong> {item.warmth}</p>
        <p><strong>Formality:</strong> {item.formality}</p>
        <p><strong>Color:</strong> {item.colorGroup}</p>
      </div>
    </div>
  );
}