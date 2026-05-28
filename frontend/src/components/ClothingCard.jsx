import { useState } from "react";

//values for each editable field, matching the backends validateCloth().
const CATEGORIES = ["top", "bottom", "shoes", "outerwear"];
const WARMTH = ["light", "medium", "heavy"];
const FORMALITY = ["casual", "formal"];
const COLOR_GROUPS = ["neutral", "warm", "cool"];

export default function ClothingCard({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false); //true while loading backend
  const [draft, setDraft] = useState(item);// working copy of the item while editing

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setBusy(true);
    try {
      const { id: _id, ...fields } = draft;
      await onUpdate(item.id, fields);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    setDraft(item);
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${item.type}" from your wardrobe?`)) return;
    setBusy(true);
    try {
      await onDelete(item.id);
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="wardrobe-card">
        <div className="wardrobe-card-top">
          <span className="card-badge">Editing</span>
        </div>

        <label className="card-edit-field">
          Type
          <input type="text" name="type" value={draft.type} onChange={handleChange} />
        </label>

        <label className="card-edit-field">
          Category
          <select name="category" value={draft.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="card-edit-field">
          Warmth
          <select name="warmth" value={draft.warmth} onChange={handleChange}>
            {WARMTH.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </label>

        <label className="card-edit-field">
          Formality
          <select name="formality" value={draft.formality} onChange={handleChange}>
            {FORMALITY.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="card-edit-field">
          Color Group
          <select name="colorGroup" value={draft.colorGroup} onChange={handleChange}>
            {COLOR_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        <div className="card-actions">
          <button className="secondary-btn" onClick={handleSave} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button className="ghost-btn" onClick={handleCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

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

      {/* Edit/Delete only work for items that have a backend id */}
      {item.id && (
        <div className="card-actions">
          <button className="secondary-btn" onClick={() => setEditing(true)} disabled={busy}>
            Edit
          </button>
          <button className="ghost-btn card-delete-btn" onClick={handleDelete} disabled={busy}>
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
