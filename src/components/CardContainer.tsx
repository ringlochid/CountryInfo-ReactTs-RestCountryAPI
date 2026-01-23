import { useEffect } from "react";
import { getAllCountries, type Country } from "../api/restcountries";
import { useCountry } from "../context/useCountry";
import { Link } from "react-router-dom";

function Card({ country } : {country: Country}){

  return (
    <Link to={`/country/${country.cca3}`} className='country-card'>
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
    </Link> 
  )
}

export function CardContainer(){
  console.log('rendering card container')

  const { country, isLoading, isLoadError, handleCountryChange, setIsLoading, setIsLoadError } = useCountry();

  useEffect(() => {
    getAllCountries()
    .then((countries) => {handleCountryChange(countries); setIsLoading(false)})
    .catch((e) => {console.error(e); setIsLoading(true);setIsLoadError(true)}) 
  }, [handleCountryChange, setIsLoading, setIsLoadError])

  if(isLoadError) {
    return (
      <div className='error-container'>
        <h2>Something went wrong</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='loading-container'>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className='country-cards-container'>
      {country.map((country) => {
        return <Card key={country.cca3} country={country}/>
      })}
    </div>
  )
}