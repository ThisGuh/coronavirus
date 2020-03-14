import React from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import './styles/App.css';
import skull from './images/skull-crossbones-solid.svg';
import flask from './images/flask-solid.svg';
import band from './images/band-aid-solid.svg';
import Helmet from 'react-helmet';


class App extends React.Component {
  state = {
    covid19Stats: [],
    country: "",
    countryData: "",
    options: countryList().getData()

  }

  componentDidMount() {
    fetch("https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "5e0b7c1cc0msh2d662756524a957p1c1dc8jsnf0a5b227038a"
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ covid19Stats: data.countries_stat }));

  }

  componentDidUpdate() {
    this.allDeaths();
    this.allCases();
    this.allRecovered();
  }

  handleSearch = (value) => {

    this.setState({
      country: value,

    })
    this.indexCountry();
  }

  indexCountry = () => {
    const index = this.state.covid19Stats.findIndex(x => x.country_name === this.state.country.label)
    return index

  }

  allDeaths = () => {
    // console.log(this.state.covid19Stats)
    let deaths = 0;
    this.state.covid19Stats.forEach(item => {
      deaths += parseFloat(item.deaths.replace(/,/g, ''));
    })
    // console.log(deaths)

    return deaths

  }
  allCases = () => {
    let cases = 0;
    this.state.covid19Stats.forEach(item => {
      cases += parseFloat(item.cases.replace(/,/g, ''));
    })
    // console.log(cases)
    return cases

  }
  allRecovered = () => {
    let recovered = 0;
    this.state.covid19Stats.forEach(item => {
      recovered += parseFloat(item.total_recovered.replace(/,/g, ''));
    })
    // console.log(recovered)
    return recovered

  }


  render() {
    const { country, covid19Stats } = this.state;
    const deaths = this.allDeaths();
    const cases = this.allCases();
    const recovered = this.allRecovered();
    const index = this.indexCountry();

    return (
      <>
        <div className="app">
          <Helmet>
            <title>Coronavirus Statistics</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content="Coronavirus(Covid-19) Statistics. Cases,deaths,recovered" />
          </Helmet>

          <header className="app__header">
            <h1 className="app__h1">Coronavirus(Covid-19)</h1>
            <h2 className="app__h2">Statistics</h2>
          </header>

          <Select className="app__search" onChange={this.handleSearch} options={this.state.options} placeholder="Country..." ></Select>
          <main className="app__main">

            <section className="app__section"><img className="app__images" src={flask} alt="flask" />{country ? covid19Stats[index].cases : cases}</section>
            <section className="app__section"><img className="app__images" src={skull} alt="skull" />{country ? covid19Stats[index].deaths : deaths}</section>
            <section className="app__section"><img className="app__images" src={band} alt="band" />{country ? covid19Stats[index].total_recovered : recovered}</section>
          </main>
          <footer className="app__footer">Created by GUH</footer>
        </div>

      </>
    );
  }
}


export default App;
