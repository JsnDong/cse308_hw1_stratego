import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../stylesheets/errorPage.css';
import titleTxt from '../stylesheets/404.svg';
import { Button } from 'react-bootstrap';

export class noMatch extends Component {
	render() {
		return (
			<div className="stratego">
				<img style={{height: 300, width: '100%', backgroundColor: 'transparent' }} src={titleTxt} />
				<Link to="/login" className="links" style={{ textDecoration: 'none' }}>
					<Button style={{ backgroundColor: '#7566BD' }} class="btn btn-primary btn-lg">
						Login to Play!
					</Button>
				</Link>
				
			</div>
		);
	}
}

export default noMatch;
