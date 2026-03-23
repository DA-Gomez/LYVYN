import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Wardrobe from "./pages/Wardrobe";
import AddItem from "./pages/AddItem";
import Recommendation from "./pages/Recommendation";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </main>
    </div>
  );
}
