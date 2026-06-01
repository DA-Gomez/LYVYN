import { useEffect, useState, useCallback } from "react";
import { getWeather } from "../services/api";
import { WeatherContext } from "./weatherContextStore";

const REFRESH_INTERVAL = 60 * 60 * 1000;

// fetches real-time weather once and shares it with every
// page so the data is consistent and only fetched once
export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches the weather and stores it in state
  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWeather();
      setWeather(data);
    } catch {
      setError("Couldn't load live weather. Check that the backend is running.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount, then refresh every hour so the weather stays current.
  useEffect(() => {
    loadWeather();
    const intervalId = setInterval(() => loadWeather(), REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [loadWeather]);

  return (
    <WeatherContext.Provider value={{ weather, loading, error, refresh: loadWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}
