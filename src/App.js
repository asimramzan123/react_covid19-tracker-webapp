// import logo from './logo.svg';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import { sortData, prettyPrintStat } from './util.js'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"


function App() {
  // using states to loop countries in dropdown
  // STATE = declaring and initializing variables like python in react, but We use state hooks in react to create variables.

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("WorldWide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])



  // GET ALL DATA USE EFFECT
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json()) //Get response and show me in json format
      .then((data) => {
        setCountryInfo(data)
      })
  }, []);

  // GET COUNTRIES DATA USE EFFECT
  // UseEffect  == runs given code based on certain conditions 
  useEffect(() => {
    // Code inside this will run once after components loads
    // async ==> send a api request, wait for it and then do something with information.

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json()) //Get response and show me in json format
        .then((data) => { // get desired data from API
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2 // Return Country Code like PK, US
          }));

          const sortedData = sortData(data)
          setCountries(countries);
          setTableData(sortedData) //Getting List of Countries Data
          setMapCountries(data)

        });
    };
    getCountriesData();

  }, []);

  // CUSTOM FUNCTIONS   
  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    console.log('Test Country', countryCode)
    setCountry(countryCode)

    const url = countryCode === 'worldwide' ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        // STORING ALL DATA FROM COUNTRY COUNTRY
        setCountryInfo(data)

        // STORING SINGLE VALUE DATA FROM COUNTRY
        setCountry(countryCode)
        setMapCenter([data.countryInfo.lat, data.countryInfo.lng])
        setMapZoom(4)
      })
    console.log('COUNTRY CODE INFO ->', countryInfo)
  }


  // RETURN / RENDER PAGE
  return (
    <div className="app">
      <div className='app__left'>

        {/* PAGE HEADER  */}
        <div class='app__header'>
          <h1> Covid19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select varient='outlined' onChange={onCountryChange} value={country}>
              {/* Get a complete list of countries option in a dropdown by using loop*/}
              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {
                // useState Hooked up in this logic
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        {/* INFO BOXES */}
        <div class='app__stats'>
          {/* WE HAVE 3 INFO BOXES 
          1: CORONA VIRUS CASES 
          2: CORONA VIRUS RECOVERIES 
          3: CORONA VIRUS DEATHS  */}
          <InfoBox 
            isRed
            active={casesType === 'cases'}
            onClick = {e => setCasesType('cases')}
            title="CoronaVirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick = {e => setCasesType('recovered')}
            title="Recovered"  
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox 
            isRed
            active={casesType === 'deaths'}
            onClick = {e => setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)} 
          />

        </div>

        {/* PAGE MAP */}
        <Map 
        casesType={casesType}
        center = {mapCenter}
        zoom = {mapZoom}
        countries ={mapCountries}

        />

      </div>

      <Card className='app__right'>
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className='app__graph' casesType={casesType} />
          </div>
        </CardContent>
        {/* Graph  */}

      </Card>
    </div>
  );
}

export default App;

