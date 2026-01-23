import { useEffect, useState } from "react";
import { searchCountries } from "../api/restcountries";
import { useCountry } from "../context/useCountry";

export const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Unselect'] as const;
export type Region = (typeof REGIONS)[number];

function FilterContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const regions = REGIONS;
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
            <div className="sr-only">filter country by region</div>
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
  const {handleCountryChange, setIsLoading} = useCountry();

  useEffect(() => {
    const id = setTimeout(() => {
      searchCountries(searchQuery)
      .then((countries) => {handleCountryChange(countries); setIsLoading(false)})
      .catch((e) => {console.error(e); setIsLoading(false);setIsError(true)}) 
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, handleCountryChange, setIsLoading])

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

export function SearchContainer() {
  
  return (
    <div className={'search-bar-container'}> 
      <SearchBar />
      <FilterContainer />
    </div>
  )
}