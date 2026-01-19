const API_BASE = 'https://restcountries.com/v3.1';

// Type definitions based on API response structure
export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface Country {
  name: CountryName;
  flags: CountryFlags;
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  tld?: string[];
  currencies?: Record<string, Currency>;
  languages?: Record<string, string>;
  borders?: string[];
  cca3: string;
}

// Homepage fields for optimized payload
const HOMEPAGE_FIELDS = 'name,flags,population,region,capital,cca3';

/**
 * Get all countries (with field filtering for homepage performance)
 */
export const getAllCountries = async (): Promise<Country[]> => {
  const res = await fetch(`${API_BASE}/all?fields=${HOMEPAGE_FIELDS}`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
};

/**
 * Search countries by name (partial matches supported)
 */
export const searchCountries = async (name: string): Promise<Country[]> => {
  const res = await fetch(`${API_BASE}/name/${encodeURIComponent(name)}`);
  if (res.status === 404) throw new Error('No results found');
  if (!res.ok) throw new Error('Failed to search countries');
  return res.json();
};

/**
 * Filter countries by region
 * Regions: africa, americas, asia, europe, oceania
 */
export const getCountriesByRegion = async (region: string): Promise<Country[]> => {
  const res = await fetch(`${API_BASE}/region/${region}`);
  if (!res.ok) throw new Error('Failed to fetch countries by region');
  return res.json();
};

/**
 * Get single country by alpha code (cca2, cca3, or ccn3)
 */
export const getCountryByCode = async (code: string): Promise<Country> => {
  const res = await fetch(`${API_BASE}/alpha/${code}`);
  if (!res.ok) throw new Error('Country not found');
  const data = await res.json();
  return data;
};

/**
 * Get multiple countries by codes (for border countries)
 */
export const getCountriesByCodes = async (codes: string[]): Promise<Country[]> => {
  if (codes.length === 0) return [];
  const res = await fetch(`${API_BASE}/alpha?codes=${codes.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch countries by codes');
  return res.json();
};

// Available regions for filter dropdown
export const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;
export type Region = (typeof REGIONS)[number];
