import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Search extends Component {

  render() {

		return (
			<form id="Search">
				<input 
	          		onSubmit ={this.handleSubmit}
	          		aria-label="Search"
					type="text"
					placeholder="Search"
	        		value={this.props.query}
	        		//as user types in, query state is updated and venues are filtered based on that
	        		onChange={(event) => 
	        			{this.props.updateQuery(event.target.value);
	        			this.props.filterVenues(event.target.value)
	        			}}/>
				<FontAwesomeIcon id="searchIcon" icon="search" />	
            </form>
		);
	}
};

export default Search;