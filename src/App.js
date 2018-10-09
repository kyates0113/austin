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
    venues : [], //all venues
    filteredVenues : [], //venues included in query
    query: "", //user search query
    markers: [], //map markers
    infoWindow: [] //info window

  }

//make axios request to get all venues from foursqaure API
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
        
      })
      .catch(error => {
        console.log("Error! "+ error)
      })
  };  

//call get all venues once component mounts
  componentDidMount(){
    this.getVenues()
  }  

//initialize map in austin
  initMap = () => {
    const austinTx = {lat: 30.2672, lng: -97.7431};
    var map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: austinTx
    })

    //create an infowindow
    var infowindow = new window.google.maps.InfoWindow({
    });
    
    //map over venues and set content of info window to the venue name
    this.state.venues.map((venue) => {
      var infoContent = venue.venue.name;

      //create a marker for each venue position
      var marker = new window.google.maps.Marker({
        position: {lat: venue.venue.location.lat, lng:venue.venue.location.lng}, 
        map: map,
        title: venue.venue.name
      });

      //add event listener to each marker to open info window on click
      marker.addListener('click', ()=> {
        infowindow.setContent(infoContent)
        infowindow.open(map, marker);
        console.log(infowindow);
        this.setState({infoWindow: infowindow})
       });
      
      //add marker to marker array
      this.state.markers.push(marker)
    })

  }

//render map, set callback of init map to this.init map
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?client=gme-nianticinc&callback=initMap")
    window.initMap = this.initMap
  }

///update query state with user input
  updateQuery = (query) => {
    this.setState({
      query: query
    })
  }

//filter venues and markers based on query
  filterVenues = (query) => {
    //for empty query, show all markers
    if(query.trim() === "") {
      this.setState({filteredVenues : this.state.venues})
      this.state.markers.forEach(m => {
      m.setVisible(true) 
    });
    }
    //otherwise hide markers where title doesnt match query
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

  //handle click on restaurant list to animate marker and show infowindow
  handleClick = (restName, restId) => {
        
      this.state.markers.forEach((m) => {
        if(m.title.toLowerCase().includes(restName.toLowerCase())) {
            m.setAnimation(window.google.maps.Animation.BOUNCE) ;
            setTimeout(function() {
              m.setAnimation(null);
            }, 800);
            var infowindow =  new window.google.maps.InfoWindow({}); 
            infowindow.setContent(restName)
            this.setState({infoWindow: infowindow});
            infowindow.open(window.map, m)
        }
        else {
            
        }
      })
  }




  render() {
    return (
      <main className="App">
        <header className="App-header">
            <h1 className="App-title">WEIRDEST PLACES IN AUSTIN</h1>
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
              handleClick = {this.handleClick}
            />
          </div>
        <div id="mapContainer">
          <div id="map" role="application"></div>
        </div>  
        <footer>Venue data provided by Foursquare</footer>
      </main>
    );
  }
}


//create a script for the google map API
function loadScript(url){
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  }



export default App;
