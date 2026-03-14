import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addClothingItem } from "../services/api";

const initialForm = {
  category: "top",
  type: "",
  warmth: "light",
  formality: "casual",
  colorGroup: "neutral",
};

export default function AddItem() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      await addClothingItem(formData);
      setStatus("success:Item added successfully! Redirecting to wardrobe...");
      setFormData(initialForm);

      setTimeout(() => {
        navigate("/wardrobe");
      }, 1500);
    } catch {
      setStatus("error:Backend not reachable. Ensure the API is running on localhost:3000.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="add-item-page">
      <div className="add-item-hero glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div className="add-item-hero-copy">
          <p className="eyebrow">NEW CLOTHING ENTRY</p>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Add Clothing Item</h1>
          <p className="page-text add-item-subtext" style={{ color: 'var(--text-muted)' }}>
            Build your wardrobe with structured clothing data so LVYVN can generate
            better recommendations based on weather, occasion, and personal style.
          </p>
        </div>

        <div className="add-item-mini-card glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
          <span className="mini-label">QUICK GUIDE</span>
          <ul className="add-item-tips" style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text-muted)' }}>
            <li style={{ marginBottom: '8px' }}>Choose the most accurate category</li>
            <li style={{ marginBottom: '8px' }}>Use a clear item name like hoodie, jeans, sneakers, or coat</li>
            <li style={{ marginBottom: '8px' }}>Select warmth and formality carefully for stronger matching</li>
            <li style={{ marginBottom: '8px' }}>Pick the closest color group for cleaner recommendations</li>
          </ul>
        </div>
      </div>

      <div className="add-item-form-shell">
        <form className="form-card add-item-form add-item-form-full" onSubmit={handleSubmit}>
          <div className="add-item-form-header">
            <div>
              <span className="mini-label">ITEM DETAILS</span>
              <h2>Add to Wardrobe</h2>
            </div>
          </div>

          <div className="form-grid add-item-grid">
            <label>
              Category
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
                <option value="outerwear">Outerwear</option>
              </select>
            </label>

            <label>
              Type
              <input
                type="text"
                name="type"
                placeholder="e.g. Hoodie"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Warmth
              <select name="warmth" value={formData.warmth} onChange={handleChange}>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </label>

            <label>
              Formality
              <select name="formality" value={formData.formality} onChange={handleChange}>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </label>

            <label className="full-width">
              Color Group
              <select name="colorGroup" value={formData.colorGroup} onChange={handleChange}>
                <option value="neutral">Neutral</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
              </select>
            </label>
          </div>

          <div className="add-item-actions add-item-actions-wide" style={{ marginTop: '32px' }}>
            <button type="submit" className="primary-btn" disabled={submitting} style={{ width: '100%', fontSize: '1.05rem', padding: '18px 20px' }}>
              {submitting ? "Saving..." : "Add to Wardrobe"}
            </button>
          </div>

          {status && (
            <div className={`style-note-box ${status.startsWith("error:") ? "error-note" : "success-note"}`} style={{ marginTop: '24px' }}>
              <p>{status.replace(/(success|error):/, "")}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}