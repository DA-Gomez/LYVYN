import { createContext } from "react";

// The React context object that holds shared weather state
// Kept in its own file so the provider file only exports components(required for React Fast Refresh to work correctly)
export const WeatherContext = createContext(null);
