import React from 'react';
import { Link } from 'react-router';

class NotFound extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render(){
		return(
			<article>
        <h1>Page not found.</h1>
        <Link to="/" className="btn">Home</Link>
      </article>
		);
	}
}

export default NotFound;