import { useContext } from "react";
import { WeatherContext } from "./weatherContextStore";

/*
  Hook used by pages to read the shared real-time weather state.
  Provides { weather, loading, error, refresh }.
*/
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used inside a WeatherProvider");
  }
  return context;
}
