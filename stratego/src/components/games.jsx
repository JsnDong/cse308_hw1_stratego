import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/games.css';

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
		axios.get('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/getHistory/1').then(
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
			<div className="gameHistory">
				<div className="header">
				<Link className="links" to="/account">
					My Profile
				</Link>
				</div>
				<h1>History</h1>
				<div className="historyContainer">
					{this.state.games.map((element) => (
						<div className="gameContainer">
						<div className="gamesRowList">
							<div className= "headings">
								<h3> Result : {this.exchange(element.winLose)}</h3>
								<h4 key={element.gameNumber}> Game #{element.gameNumber}</h4>
							</div>
							<div className="replayBtnContainer">
							<Link to="/replay">
								Watch Replay
							</Link>
							</div>
						</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default games;
