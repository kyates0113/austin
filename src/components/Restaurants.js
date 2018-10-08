import React, { Component } from 'react';

class Restaurant extends Component {

  

  render() {
    return (
      
    <div className="RestContainer">
        {this.props.filteredVenues
            .map((item, index) => {
              return (
                <div id="Restaurant" key={index}>
                    <h1>{item.venue.name}</h1>
                    <h2>{item.venue.location.address}</h2>


                </div>
              );
            })}
    </div> 



    )
  }  
   
};

export default Restaurant;