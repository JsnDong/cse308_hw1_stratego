import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

export class noMatch extends Component {
	render() {
		return (
			<div>
				<h1>404</h1>
				<Link to="/login" style={{ textDecoration: 'none' }}>
					<button>Log in to play!</button>
				</Link>
			</div>
		);
	}
}

export default noMatch;
