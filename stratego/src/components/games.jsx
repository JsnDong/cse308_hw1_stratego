import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

export class games extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username,
			games: []
		};
	}

	componentDidMount = () => {
		this.getGames();
	};

	getGames = () => {
		axios.get('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/getHistory/' + this.state.username).then(
			(res) => {
				console.log(res);
				this.setState({
					games: res.data
				});
			},
			(err) => {
				console.log(err);
			}
		);
	};

	exchange(num) {
		if (num == 0) return 'Lose';
		if (num == 1) return 'Win';
		if (num == 2) return 'Draw';
	}

	render() {
		return (
			<div>
				<h1>History</h1>
				<Link to="/account" style={{ textDecoration: 'none' }}>
					<button>My Profile</button>
				</Link>
				<div className="historyContainer">
					{this.state.games.map((element) => (
						<div className="gamesRowList">
							<h4 key={element.gameNumber}> Game ID : {element.gameNumber}</h4>
							<h4> Result : {this.exchange(element.winLose)}</h4>
							<h4>Game Time : {element.time}</h4>
							<Link to="/replay" style={{ textDecoration: 'none' }}>
								<button>Watch Replay</button>
							</Link>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default games;
