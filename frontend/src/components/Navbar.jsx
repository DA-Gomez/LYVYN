import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo-wrap">
        <div className="logo-mark">L</div>
        <div>
          <div className="logo">LVYVN</div>
          <p className="logo-sub">Virtual wardrobe intelligence</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Home
        </NavLink>
        <NavLink to="/wardrobe" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Wardrobe
        </NavLink>
        <NavLink to="/add-item" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Add Item
        </NavLink>
        <NavLink
          to="/recommendation"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Recommendation
        </NavLink>
      </nav>
    </header>
  );
}