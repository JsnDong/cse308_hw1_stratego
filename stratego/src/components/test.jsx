import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usernameGet: 'TESTuser1',
			usernamePut: 'd',
			passwordPut: 'c',
			testingList: [ 1, 2, 3 ]
		};
	}

	getAllInfo() {
		axios.get('http://localhost:8080/allUsers').then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(res);
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	}

	getSingleInfo(username) {
		axios.get('http://localhost:8080/users/' + username).then(
			(res) => {
				alert('Received Successful response from server!');
				console.log(res);
			},
			(err) => {
				alert('Server rejected response with: ' + err);
			}
		);
	}

	createUser(username, password) {
		var user = {
			username: "pop",
			password: "lol"
		};
		axios.post('http://localhost:8080/userPost', user).then(
			(response) => {
				alert('Received Successful response from server!');
				console.log(response);
			},
			(error) => {
				console.log(error);
			}
		);
	}

	passList(username, password, testList) {
		axios
			.post('http://localhost:8080/userList', {
				username: username,
				password: [
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
				]
			})
			.then(
				(response) => {
					alert('Received Successful response from server!');
					console.log(response);
				},
				(error) => {
					console.log(error);
				}
			);
	}

	render() {
		return (
			<div className="info">
				<button onClick={this.getAllInfo}>Get All User Request!</button>
				<button onClick={() => this.getSingleInfo(this.state.usernamePut)}>Get Single User Request!</button>
				<button onClick={() => this.createUser(this.state.usernamePut, this.state.passwordPut)}>
					Create User Request!
				</button>
				<button
					onClick={() =>
						this.passList(this.state.usernamePut, this.state.passwordPut, this.state.testingList)}
				>
					Trying to Pass List
				</button>
			</div>
		);
	}
}
export default test;
