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
  const data = await res.json();
  return data;
};

/**
 * Helper to create a fetch promise that rejects on non-ok responses
 */
const fetchOrReject = async (url: string): Promise<Country[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};

/**
 * Search countries by name, capital, or code (parallel search)
 * Uses Promise.any() to run all searches simultaneously and return the first success
 */
export const searchCountries = async (name: string, isDetail: boolean = false): Promise<Country[]> => {
  if (!name) {
    return getAllCountries();
  }

  const fieldParams = `fields=${HOMEPAGE_FIELDS}`;

  const nameUrl = isDetail 
    ? `${API_BASE}/name/${encodeURIComponent(name)}` 
    : `${API_BASE}/name/${encodeURIComponent(name)}?${fieldParams}`;
  
  const capitalUrl = isDetail 
    ? `${API_BASE}/capital/${encodeURIComponent(name)}` 
    : `${API_BASE}/capital/${encodeURIComponent(name)}?${fieldParams}`;
  
  const codeUrl = isDetail 
    ? `${API_BASE}/alpha?codes=${encodeURIComponent(name)}` 
    : `${API_BASE}/alpha?codes=${encodeURIComponent(name)}&${fieldParams}`;

  const searchPromises: Promise<Country[]>[] = [
    fetchOrReject(nameUrl),
    fetchOrReject(capitalUrl),
  ];

  if (name.length <= 3) {
    searchPromises.push(fetchOrReject(codeUrl));
  }

  try {
    const result = await Promise.any(searchPromises);
    return result;
  } catch {
    throw new Error('Country not found');
  }
};

/**
 * Search countries by code only (for specific code lookups)
 */
export const searchCountriesByCode = async (code: string, isDetail: boolean = false): Promise<Country[]> => {
  const fieldParams = `fields=${HOMEPAGE_FIELDS}`;
  const url = isDetail 
    ? `${API_BASE}/alpha?codes=${encodeURIComponent(code)}` 
    : `${API_BASE}/alpha?codes=${encodeURIComponent(code)}&${fieldParams}`;
  
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error('Failed to search countries');
  return res.json();
};

/**
 * Search countries by capital only (for specific capital lookups)
 */
export const searchCountriesByCapital = async (capital: string, isDetail: boolean = false): Promise<Country[]> => {
  const fieldParams = `fields=${HOMEPAGE_FIELDS}`;
  const url = isDetail 
    ? `${API_BASE}/capital/${encodeURIComponent(capital)}` 
    : `${API_BASE}/capital/${encodeURIComponent(capital)}?${fieldParams}`;
  
  const res = await fetch(url);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error('Failed to search countries');
  return res.json();
};

/**
 * Filter countries by region
 * Regions: africa, americas, asia, europe, oceania
 */
export const getCountriesByRegion = async (region: string | null): Promise<Country[]> => {
  if (!region) {
    return getAllCountries();
  }
  const params = new URLSearchParams({
    fields: HOMEPAGE_FIELDS 
  });
  const res = await fetch(`${API_BASE}/region/${region}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch countries by region');
  const data = await res.json();
  return data;
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
  const data = await res.json();
  return data;
};
