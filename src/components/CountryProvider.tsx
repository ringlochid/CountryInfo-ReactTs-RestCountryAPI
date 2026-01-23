import { useCallback, useState } from "react";
import type { Country } from "../api/restcountries";
import { countryContext } from "../context/countryContext";

export function CountryProvider({ children } : {children: React.ReactNode}) {
  const [country, setCountry] = useState<Country[]>([]);
  const [region, setRegion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadError, setIsLoadError] = useState(false);

  const handleRegionChange = useCallback((region : string | null) => {
    setRegion(region);
  }, []);

  const handleCountryChange = useCallback((countries : Country[]) => {
      setCountry(region? countries.filter(country => country.region === region) : countries);
    }, [region]); 

  return (
    <countryContext.Provider value={{country, region, isLoading, isLoadError, handleCountryChange, handleRegionChange, setIsLoading, setIsLoadError}}>
      {children}
    </countryContext.Provider>
  );

}