import { createContext } from "react";
import type { Country } from "../api/restcountries";

interface countryContextType {
  country: Country[];
  region: string | null;
  isLoading: boolean;
  isLoadError: boolean;
  handleCountryChange: (countries: Country[]) => void;
  handleRegionChange: (region: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadError: (isLoadError: boolean) => void;
}

export const countryContext = createContext<countryContextType | null>(null);