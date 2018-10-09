import React, { Component } from 'react';

class Restaurant extends Component {

  render() {
    return (
      
    <div className="RestContainer">
        {this.props.filteredVenues
            .map((item, index) => {
              return (
                <div className="Restaurant" 
                    tabindex="0"
                    key={index} 
                    onClick={()=> this.props.handleClick(item.venue.name, index)}>
                  <h1>{item.venue.name}</h1>
                  <p>{item.venue.location.address}</p>
                </div>
              );
            })}
    </div> 



    )
  }  
   
};

export default Restaurant;