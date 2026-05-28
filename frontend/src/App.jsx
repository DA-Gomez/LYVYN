import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Wardrobe from "./pages/Wardrobe";
import AddItem from "./pages/AddItem";
import Recommendation from "./pages/Recommendation";
import NotFound from "./pages/NotFound";
import { WeatherProvider } from "./context/WeatherContext";

export default function App() {
  return (
    // WeatherProvider makes  weather available to every page
    <WeatherProvider>
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </WeatherProvider>
  );
}
