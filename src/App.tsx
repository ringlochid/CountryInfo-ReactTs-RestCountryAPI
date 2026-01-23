import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type {Country} from './api/restcountries'
import { getAllCountries, searchCountries, getCountryByCode } from './api/restcountries'
import './App.css'

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

interface countryContextType {
  country: Country[];
  region: string | null;
  handleCountryChange: (countries: Country[]) => void;
  handleRegionChange: (region: string | null) => void;
}

const themeContext = createContext<ThemeContextType | null>(null);
const countryContext = createContext<countryContextType | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  )
}


function useTheme() {
  const context = useContext(themeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context;
}

function CountryProvider({ children } : {children: React.ReactNode}) {
  console.log('rendering country context');
  const [country, setCountry] = useState<Country[]>([]);
  const [region, setRegion] = useState<string | null>(null);

  const handleRegionChange = useCallback((region : string | null) => {
    setRegion(region);
  }, []);

  const handleCountryChange = useCallback((countries : Country[]) => {
      setCountry(countries);
      if (region){
        setCountry(prev => prev.filter(country => country.region === region));
      }
    }, [region]); 

  return (
    <countryContext.Provider value={{country, region, handleCountryChange, handleRegionChange}}>
      {children}
    </countryContext.Provider>
  );

}

function useCountry() {
  const context = useContext(countryContext);
  if (!context) {
    throw new Error('useCountry must be used within a provider.')
  }
  return context;
}

function ThemeSwitcherIcon() {
  const {theme} = useTheme();
  
  if (theme === 'light') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.8426 11.052C7.73486 11.052 5.21543 8.74226 5.21543 5.89457C5.21543 4.82024 5.57343 3.82526 6.18514 3C3.75229 3.75612 2 5.86498 2 8.35045C2 11.4708 4.75943 14 8.16286 14C10.8743 14 13.1757 12.3945 14 10.1636C13.1 10.7238 12.0129 11.052 10.8426 11.052Z" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10.5904 0.0362357C10.7368 0.0977502 10.8423 0.229567 10.8716 0.384818L11.4545 3.54549L14.6152 4.12549C14.7704 4.15478 14.9022 4.26023 14.9638 4.4067C15.0253 4.55316 15.0077 4.72013 14.9169 4.85195L13.092 7.5L14.9169 10.1451C15.0077 10.2769 15.0253 10.4439 14.9638 10.5904C14.9022 10.7368 14.7704 10.8423 14.6152 10.8716L11.4545 11.4545L10.8716 14.6152C10.8423 14.7704 10.7368 14.9022 10.5904 14.9638C10.4439 15.0253 10.2769 15.0077 10.1451 14.9169L7.5 13.092L4.85487 14.9169C4.72306 15.0077 4.55609 15.0253 4.40963 14.9638C4.26316 14.9022 4.15771 14.7704 4.12842 14.6152L3.54549 11.4545L0.384818 10.8716C0.229567 10.8423 0.0977502 10.7368 0.0362357 10.5904C-0.0252788 10.4439 -0.00770325 10.2769 0.0831039 10.1451L1.90804 7.5L0.0831039 4.85487C-0.00770325 4.72306 -0.0252788 4.55609 0.0362357 4.40963C0.0977502 4.26316 0.229567 4.15771 0.384818 4.12842L3.54549 3.54549L4.12842 0.384818C4.15771 0.229567 4.26316 0.0977502 4.40963 0.0362357C4.55609 -0.0252788 4.72306 -0.00770325 4.85487 0.0831039L7.5 1.90804L10.1451 0.0831039C10.2769 -0.00770325 10.4439 -0.0252788 10.5904 0.0362357ZM4.68791 7.5C4.68791 6.75419 4.98418 6.03892 5.51155 5.51155C6.03892 4.98418 6.75419 4.68791 7.5 4.68791C8.24581 4.68791 8.96108 4.98418 9.48845 5.51155C10.0158 6.03892 10.3121 6.75419 10.3121 7.5C10.3121 8.24581 10.0158 8.96108 9.48845 9.48845C8.96108 10.0158 8.24581 10.3121 7.5 10.3121C6.75419 10.3121 6.03892 10.0158 5.51155 9.48845C4.98418 8.96108 4.68791 8.24581 4.68791 7.5ZM11.2495 7.5C11.2495 6.50558 10.8544 5.55189 10.1513 4.84873C9.44811 4.14557 8.49442 3.75054 7.5 3.75054C6.50558 3.75054 5.55189 4.14557 4.84873 4.84873C4.14557 5.55189 3.75054 6.50558 3.75054 7.5C3.75054 8.49442 4.14557 9.44811 4.84873 10.1513C5.55189 10.8544 6.50558 11.2495 7.5 11.2495C8.49442 11.2495 9.44811 10.8544 10.1513 10.1513C10.8544 9.44811 11.2495 8.49442 11.2495 7.5Z" fill="white"/>
    </svg>
  )
}

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <>
      <label htmlFor="theme-switcher">
        <ThemeSwitcherIcon />
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </label>
      <input 
        type="checkbox" 
        id="theme-switcher" 
        checked={isDark}
        onChange={toggleTheme}
      />
    </>
  )
}

function HeaderContainer() {
  return (
    <header className='header-container'>
      <div className='header'>
        <h1>Where in the world?</h1>
        <div className='header-theme-container'>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}


function Card({ country } : {country: Country}){

  return (
    <button className='country-card'>
      <div className='country-card-image-container'>
        <img src={country['flags']['png']} alt={country['flags']['alt']} />
      </div>
      <div className='country-card-details'>
        <div className='country-stats'>
          <h2>{country['name']['official']}</h2>
          <p><strong>Population:</strong> {country['population']}</p>
          <p><strong>Region:</strong> {country['region']}</p>
          <p><strong>Capital:</strong>{country['capital']}</p>
        </div>
      </div>
    </button> 
  )
}

function CardContainer(){

  const { country, handleCountryChange } = useCountry();

  useEffect(() => {
    getAllCountries()
    .then((countries) => {handleCountryChange(countries)})
    .catch((e) => {console.error(e)}) 
  }, [handleCountryChange])

  return (
    <div className='country-cards-container'>
      {country.map((country) => {
        return <Card key={country.cca3} country={country}/>
      })}
    </div>
  )
}

function FilterContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Unselect'];

  const {region, handleRegionChange } = useCountry();

  return (
    <div className='filter-container'>
      <div 
        className='filter-dropdown'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='filter-header'>
          <span>{region ?? 'Filter by Region'}</span>
          <button type="button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none"
              className={isOpen ? 'expanded' : ''}
              >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L5 4.29289L8.64645 0.646447C8.84171 0.451184 9.15829 0.451184 9.35355 0.646447C9.54882 0.841709 9.54882 1.15829 9.35355 1.35355L5.35355 5.35355C5.15829 5.54882 4.84171 5.54882 4.64645 5.35355L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z" 
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <ul className='region-list'>
          {regions.map((region) => (
            <li 
              key={region}
              className='region-item'
              onClick={() => {
                if (region === 'Unselect'){
                  handleRegionChange(null);
                  return;
                }
                handleRegionChange(region);
                setIsOpen(false);
              }}
            >
              {region}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const {handleCountryChange} = useCountry();

  useEffect(() => {
    const id = setTimeout(() => {
      searchCountries(searchQuery)
      .then((countries) => {handleCountryChange(countries)})
      .catch((e) => {console.error(e); setIsError(true)}) 
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, handleCountryChange])

  return (
    <div className='search-wrapper'>
    <div className={`search-container ${isError ? 'error' : ''}`}>
      <div className='search-bar'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.1111 9.77778H10.4L10.1333 9.51111C11.0222 8.53333 11.5556 7.2 11.5556 5.77778C11.5556 2.57778 8.97778 0 5.77778 0C2.57778 0 0 2.57778 0 5.77778C0 8.97778 2.57778 11.5556 5.77778 11.5556C7.2 11.5556 8.53333 11.0222 9.51111 10.1333L9.77778 10.4V11.1111L14.2222 15.5556L15.5556 14.2222L11.1111 9.77778ZM5.77778 9.77778C3.55556 9.77778 1.77778 8 1.77778 5.77778C1.77778 3.55556 3.55556 1.77778 5.77778 1.77778C8 1.77778 9.77778 3.55556 9.77778 5.77778C9.77778 8 8 9.77778 5.77778 9.77778Z" fill="currentColor"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search for a country..." 
          value={searchQuery} 
          onChange={(e) => {setSearchQuery(e.target.value); setIsError(false)}} 
          />
      </div>
    </div>
    {isError && <p className='search-error-message'>No results found</p>}
    </div>
  )
}

function SearchContainer() {
  
  return (
    <div className={'search-bar-container'}> 
      <SearchBar />
      <FilterContainer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CountryProvider>
        <HeaderContainer />
        <main>
          <SearchContainer />
          <CardContainer />
        </main>
      </CountryProvider>
    </ThemeProvider>
  )
}

export default App
