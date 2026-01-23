import { useContext } from "react";
import { countryContext } from "./countryContext";

export function useCountry() {
  const context = useContext(countryContext);
  if (!context) {
    throw new Error('useCountry must be used within a provider.')
  }
  return context;
}