import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: 'testingGame',
			winLose: 0, //0 = Lose, 1 = Win
			time: '15:00',
			moveList: [
				{
					startRow: 1,
					startCol: 2,
					endRow: 3,
					endCol: 4
				},
				{
					startRow: 1,
					startCol: 2,
					endRow: 3,
					endCol: 4
				}
			],
			startList: [
				[ 1, 2, 3, 4, 5, 6 ],
				[ 7, 8, 9, 10, 11, 12, 13 ],
				[ 14, 15, 16, 17, 18 ],
				[ null, null ],
				[ 19, 20 ],
				[ 21, 22 ],
				[ 23, 24 ]
			]
		};
	}

	createGame = (e) => {
		const game = {
			username: this.state.username,
			winLose: this.state.winLose,
			time: this.state.time,
			moveList: this.state.moveList,
			startList: this.state.startList
		};
		e.preventDefault();

		axios.post('http://localhost:8080/createGame', game).then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(res);
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	};

	getInfo = (e) => {
		e.preventDefault();
		const username = '1';
		axios.get('http://localhost:8080/getInfo/' + username).then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(res);
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	};

	getHistory = (e) => {
		e.preventDefault();
		const username = '1';
		axios.get('http://localhost:8080/getHistory/' + username).then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(res.data);
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	};

	getGame = (e) => {
		e.preventDefault();
		const id = 27; // CHANGE ID
		axios.get('http://localhost:8080/getGame/' + id).then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(JSON.parse(res.data.moveListDe));
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	};

	render() {
		return (
			<div className="info">
				<button onClick={this.createGame}>Create Game!</button>
				<button onClick={this.getInfo}>Get Account Info!</button>
				<button onClick={this.getHistory}>Get All Game!</button>
				<button onClick={this.getGame}>Get One Game!</button>
			</div>
		);
	}
}
export default test;
