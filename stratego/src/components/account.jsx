import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

class account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username,
			win: 0,
			lose: 0,
			draw: 0,
			avgTime: ''
		};
	}

	handleLogOut() {
		localStorage.removeItem('token');
	}

	componentDidMount = () => {
		this.getInfo();
	};

	getInfo = () => {
		axios.get('http://localhost:8080/getInfo/' + this.state.username).then(
			(res) => {
				console.log(res);
				this.setState({
					win: res.data.totalWin,
					lose: res.data.totalLose,
					draw: res.data.totalTie,
					avgTime: res.data.averageTime
				});
			},
			(err) => {
				console.log(err);
			}
		);
	};

	render() {
		return (
			<div className="info">
				<h1>My Account Page</h1>
				<div>
					<Link to="/play" style={{ textDecoration: 'none' }}>
						<button>Play!</button>
					</Link>
					<Link to="/login" style={{ textDecoration: 'none' }}>
						<button onClick={this.handleLogOut}>Sign out</button>
					</Link>
					<ul>
						<h3>Username: {this.state.username}</h3>
						<Link to="/games" style={{ textDecoration: 'none' }}>
							<li>Past Games</li>
						</Link>
						<li> Total Win: {this.state.win}</li>
						<li> Total Lost: {this.state.lose}</li>
						<li> Total Draw: {this.state.draw}</li>
						<li> Average Game Time: {this.state.avgTime} </li>
					</ul>
				</div>
			</div>
		);
	}
}
export default account;
