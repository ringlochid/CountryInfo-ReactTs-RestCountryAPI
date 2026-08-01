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
  cca2?: string;
  cca3: string;
}

interface LegacyCurrency extends Currency {
  code?: string;
}

interface LegacyLanguage {
  iso639_1?: string;
  iso639_2?: string;
  name: string;
}

interface LegacyCountry {
  name: string;
  nativeName?: string;
  topLevelDomain?: string[];
  alpha2Code?: string;
  alpha3Code: string;
  capital?: string;
  subregion?: string;
  region: string;
  population: number;
  borders?: string[];
  flags: {
    svg: string;
    png: string;
  };
  currencies?: LegacyCurrency[];
  languages?: LegacyLanguage[];
}

const DATA_URL = `${import.meta.env.BASE_URL}data.json`;
let countriesPromise: Promise<Country[]> | undefined;

const toCurrencyRecord = (currencies?: LegacyCurrency[]) => {
  if (!currencies?.length) return undefined;

  return Object.fromEntries(
    currencies.map((currency, index) => [
      currency.code ?? `currency-${index}`,
      { name: currency.name, symbol: currency.symbol },
    ]),
  );
};

const toLanguageRecord = (languages?: LegacyLanguage[]) => {
  if (!languages?.length) return undefined;

  return Object.fromEntries(
    languages.map((language, index) => [
      language.iso639_2 ?? language.iso639_1 ?? `language-${index}`,
      language.name,
    ]),
  );
};

const toCountry = (country: LegacyCountry): Country => ({
  name: {
    common: country.name,
    official: country.name,
    nativeName: country.nativeName
      ? {
          default: {
            common: country.nativeName,
            official: country.nativeName,
          },
        }
      : undefined,
  },
  flags: {
    ...country.flags,
    alt: `Flag of ${country.name}`,
  },
  population: country.population,
  region: country.region,
  subregion: country.subregion,
  capital: country.capital ? [country.capital] : undefined,
  tld: country.topLevelDomain,
  currencies: toCurrencyRecord(country.currencies),
  languages: toLanguageRecord(country.languages),
  borders: country.borders,
  cca2: country.alpha2Code,
  cca3: country.alpha3Code,
});

const loadCountries = (): Promise<Country[]> => {
  if (!countriesPromise) {
    countriesPromise = fetch(DATA_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load country data (${response.status})`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Country data has an invalid format');
        }

        return (data as LegacyCountry[]).map(toCountry);
      })
      .catch((error: unknown) => {
        countriesPromise = undefined;
        throw error;
      });
  }

  return countriesPromise;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const getAllCountries = async (): Promise<Country[]> => loadCountries();

export const searchCountries = async (
  query: string,
  isDetail: boolean = false,
): Promise<Country[]> => {
  void isDetail;

  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return getAllCountries();

  const countries = await loadCountries();
  const matches = countries.filter((country) => {
    const matchesName =
      normalize(country.name.common).includes(normalizedQuery) ||
      normalize(country.name.official).includes(normalizedQuery);
    const matchesCapital = country.capital?.some((capital) =>
      normalize(capital).includes(normalizedQuery),
    );
    const matchesCode =
      country.cca3.toLocaleLowerCase() === normalizedQuery ||
      country.cca2?.toLocaleLowerCase() === normalizedQuery;

    return matchesName || matchesCapital || matchesCode;
  });

  if (!matches.length) throw new Error('Country not found');
  return matches;
};

export const searchCountriesByCode = async (
  code: string,
  isDetail: boolean = false,
): Promise<Country[]> => {
  void isDetail;

  const normalizedCode = normalize(code);
  const countries = await loadCountries();
  return countries.filter(
    (country) =>
      country.cca3.toLocaleLowerCase() === normalizedCode ||
      country.cca2?.toLocaleLowerCase() === normalizedCode,
  );
};

export const searchCountriesByCapital = async (
  capital: string,
  isDetail: boolean = false,
): Promise<Country[]> => {
  void isDetail;

  const normalizedCapital = normalize(capital);
  const countries = await loadCountries();
  return countries.filter((country) =>
    country.capital?.some((value) => normalize(value).includes(normalizedCapital)),
  );
};

export const getCountriesByRegion = async (
  region: string | null,
): Promise<Country[]> => {
  if (!region) return getAllCountries();

  const normalizedRegion = normalize(region);
  const countries = await loadCountries();
  return countries.filter((country) => normalize(country.region) === normalizedRegion);
};

export const getCountryByCode = async (code: string): Promise<Country> => {
  const matches = await searchCountriesByCode(code, true);
  const country = matches[0];
  if (!country) throw new Error('Country not found');
  return country;
};

export const getCountriesByCodes = async (codes: string[]): Promise<Country[]> => {
  if (!codes.length) return [];

  const normalizedCodes = new Set(codes.map((code) => normalize(code)));
  const countries = await loadCountries();
  return countries.filter((country) =>
    normalizedCodes.has(country.cca3.toLocaleLowerCase()),
  );
};
