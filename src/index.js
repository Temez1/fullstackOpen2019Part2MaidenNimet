import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const App = () => {

  const endpointCountries = 'https://restcountries.eu/rest/v2/all'

  const [countries, setCountries] = useState([])
  const [countryName, setCountryName] = useState('')
  const [showAllCountries, setShowAllCountries] = useState(true)

  const handleCountryName = (e) => {
    setCountryName(e.target.value)
    if (e.target.value === '') {
      setShowAllCountries(true)
    }
    else {
      setShowAllCountries(false)
    }
  }

  useEffect(() => {
    axios
      .get(endpointCountries)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return(
    <div>
      find countries <input value={countryName} onChange={handleCountryName}/>
      <Countries countries={countries}
                 countryNameState={countryName} 
                 showAllCountriesState={showAllCountries} />
    </div>
  )
}

const Countries = ({countries, countryNameState, showAllCountriesState}) => {
    
  const [showCountriesList, setShowCountriesList] = useState(true)
  const [selectCountry, setSelectCountry] = useState('')

  const filteredCountries = showAllCountriesState ? countries : countries
                                                          .filter(country => country.name.toUpperCase()
                                                                    .includes(countryNameState.toUpperCase()))
                                                                                                                           
  const filteredCountriesAmount = Object.keys(filteredCountries).length

  const handleSelectCountry = (country) => ( 
    () => {
      setShowCountriesList(false)
      setSelectCountry(country)
    }
  )

  const countriesList = (countries, selectCountryHandler) => {
    console.log(countries)
    return(
    <div> {countries
      .map(country =>
        <div key={country.name}>
          {country.name}
          <button onClick={selectCountryHandler(country)}> show </button>
        </div>
        )} 
    </div>)
  }

  if ( filteredCountriesAmount > 10) {
    return(
      <div><p>Too many matches, specify another filter</p></div>
    )
  }
  else if (filteredCountriesAmount > 1){
    if ( !showCountriesList){
      return(
        <div>
          <Country country={selectCountry} />
        </div>
      )
    }
    else {
      return(
        countriesList(filteredCountries, handleSelectCountry)
      )
    }
  }
  else if (filteredCountriesAmount === 1) {
    return(
      <div>
        <Country country={filteredCountries[0]} />
      </div>
    )
  }
  return(
    <div><p>No country found</p></div>
  )
}

const Country = ({country}) => (
  <div>
    <h2>{country.name}</h2>
    <p>capital: {country.capital}</p>
    <p>population: {country.population} </p>

    <div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language => <li key={language.name} >{language.name}</li>)}
      </ul>
    </div>

    <Image src={country.flag} alt={`${country.name} flag`} width={100} height={100} />
  </div>
)

const Image = ({src, alt, width, height}) => (
  <img
    src={src}
    alt={alt}
    width={`${width}`}
    height={`${height}`}>
  </img>
)
ReactDOM.render(<App />, document.getElementById('root'));
