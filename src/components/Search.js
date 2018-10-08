import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




class Search extends Component {

	

  render() {

		return (
			<form id="Search"
			
			>
			<input 
          		onSubmit ={this.handleSubmit}
				type="text"
				placeholder="Search Restaurants"
        		value={this.props.query}
        		onChange={(event) => 
        			{this.props.updateQuery(event.target.value);
        			this.props.filterVenues(event.target.value)
        			}}/>
				<FontAwesomeIcon id="searchIcon"
					icon="search" />
			

            </form>
		);
	}
};

export default Search;