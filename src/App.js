import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Search from './components/Search';
import Restaurants from './components/Restaurants';

library.add(
  faSearch);

class App extends Component {

  state = {
    venues : [],
    filteredVenues : [],
    query: "",
    markers: []

  }

  updateQuery = (query) => {
    this.setState({
      query: query
    })
  }

  filterVenues = (query) => {
    if(query.trim() === "") {
      this.setState({filteredVenues : this.state.venues})
      this.state.markers.forEach(m => {
      m.setVisible(true) 
    });
    }
    else 
    {let f = query ? this.state.venues.filter(venue => venue.venue.name.toLowerCase().includes(query)) : this.venues;
      this.state.markers.forEach(m => {
        m.title.toLowerCase().includes(query) ?
      m.setVisible(true) :
      m.setVisible(false);
    });
    this.setState({filteredVenues : f})      
    }
  }

  componentDidMount(){
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?client=gme-nianticinc&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    const austinTx = {lat: 30.2672, lng: -97.7431};
    var map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: austinTx
    })

    var infowindow = new window.google.maps.InfoWindow({
    });
  


    this.state.venues.map((venue) => {
            var infoContent = venue.venue.name;

      var marker = new window.google.maps.Marker({
        position: {lat: venue.venue.location.lat, lng:venue.venue.location.lng}, 
        map: map,
        title: venue.venue.name
      });

      marker.addListener('click', function() {
        infowindow.setContent(infoContent)
        infowindow.open(map, marker);

      });
    
      this.state.markers.push(marker)
    })

  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id : "XNINS0HJQLQYHWNOFVQ1XLTPTQXIFXSYK5KZD4BVZEE5AJU4",
      client_secret : "01VAHEGHA4ZK2OG3C5CIPI5Z25Y5EF5VPESNWPV1YNAXGEOP",
      query : "weird",
      near : "Austin, TX",
      v: "20182507"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items, filteredVenues: response.data.response.groups[0].items
        }, this.renderMap())
        console.log(response.data.response.groups[0].items)
      })
      .catch(error => {
        console.log("Error! "+ error)
      })
  }


  render() {
    return (
      <main className="App">
        <header className="App-header">
            <h1 className="App-title">Austin</h1>
        </header>
        <div className="ListingContainer">
            <Search 
              venues = {this.state.venues}
              query={this.state.query}
              updateQuery = {this.updateQuery}
              filterVenues = {this.filterVenues}
            />
            <Restaurants 
              filteredVenues = {this.state.filteredVenues}
              query={this.state.query}
            />
          </div>
        <div id="mapContainer">
          <div id="map"></div>
        </div>  
      </main>
    );
  }
}



function loadScript(url){
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  }



export default App;
