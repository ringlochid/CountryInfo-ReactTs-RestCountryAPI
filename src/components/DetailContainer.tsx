import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCountryByCode, type Country } from '../api/restcountries';
import { useEffect, useState } from 'react';
import { useCountry } from '../context/useCountry';

function BackButton({ navigate }: { navigate: (path: string) => void }) {
    return (
        <button className="back-btn" onClick={() => navigate('/')}>
            <div className='back-btn-content'>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.30337 3.18198L6.36403 4.24264L2.86385 7.74282H16.2282L16.2282 9.22774H2.86385L6.36403 12.7279L5.30337 13.7886L7.03335e-05 8.48528L5.30337 3.18198Z" fill="currentColor"/>
                </svg>
                <span>Back</span>
            </div>
        </button>
    )
}

const getBorderName = (code: string) => {
    const {country} = useCountry();
    const borderCountry = country?.find(c => c.cca3 === code);
    return borderCountry ? borderCountry.name.common : code;
  };

function BorderContainer({detailedCountry} : {detailedCountry: Country}){
    if (!detailedCountry['borders']){
        return null;
    }
    const code = detailedCountry['borders'];
    return (
        <div className='country-detail-stats-border-container'>
            <h2>Border Countries:</h2>
            <div className='country-detail-stats-border'>
                {code.map((key, index) => (
                    <Link key={index} to={`/country/${key}`} className='country-detail-stats-border-btn'>
                        <span>{getBorderName(key)}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function CountryDetailStats({detailedCountry}: {detailedCountry: Country}) {

    return  (
        <div className='country-detail-stats-container'>
            <h1>{detailedCountry['name']['common']}</h1>
            <div className='country-detail-stats'>
                <div className='country-detail-stats-main-container'>
                    <p className='country-detail-stats-key'>Native Name:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.name.nativeName 
                                ? Object.values(detailedCountry.name.nativeName)[0].common 
                                : detailedCountry.name.common}
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Population:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.population}
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Region:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.region}
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Sub Region:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.subregion}
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Capital:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.capital}
                        </span>
                    </p>
                </div>
                <div className='country-detail-stats-sub-container'>
                    <p className='country-detail-stats-key'>Top Level Domain:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.tld}
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Currencies:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.currencies 
                                ? Object.values(detailedCountry.currencies).map(c => c.name).join(', ') 
                                : 'N/A'
                            }
                        </span>
                    </p>
                    <p className='country-detail-stats-key'>Languages:
                        <span className='country-detail-stats-value'>
                            {detailedCountry.languages 
                                ? Object.values(detailedCountry.languages).join(', ') 
                                : 'N/A'
                            }
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

function CountryInfo({ detailedCountry }: { detailedCountry: Country }) {
    return (
        <div className='country-info'>

            <img src={detailedCountry['flags']['png']} alt={detailedCountry['flags']['alt']} />
            <div className='country-detail-container'>
                <CountryDetailStats detailedCountry={detailedCountry} />
                <BorderContainer detailedCountry={detailedCountry} />
            </div>
        </div>
    )
}

export function DetailContainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailedCountry, setDetailedCountry] = useState<Country | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCountryByCode(id!)
    .then((country) => {
        const countryData = Array.isArray(country) ? country[0] : country;
        setDetailedCountry(countryData); 
        setIsLoading(false)
    })
    .catch((e) => {
        console.error(e); 
        setIsLoading(false);
        setIsError(true)
    })
  }, [id]);

  if(isError) {
    return (
      <div className='error-container'>
        <h2>Something went wrong</h2>
      </div>
    )
  }

  if(isLoading) {
    return (
      <div className='loading-container'>
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <main>
        <div className='detail-page-container'>
            <BackButton navigate={navigate}/>
            {detailedCountry && <CountryInfo detailedCountry={detailedCountry}/>}
       </div>
    </main>
  )
}