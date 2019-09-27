import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

class account extends Component {
	render() {

		return (
			<div className="info">
				<h1>My Account Page</h1>
				<div>
					<ul>
						<h3>Username: JamesAngeles</h3>
						<Link to="/games" style={{ textDecoration: 'none' }}>
							<li>Past Games</li>
						</Link>
						<li> Win Rate: 70% (35/50)</li>
						<li> Average Game Time: 25:00 </li>
					</ul>
				</div>
			</div>
		);
	}
}
export default account;