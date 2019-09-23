import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';


class login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			username: '',
			password: '',
			errors: ''
		};
	}

	handleCredentialChange = (e, credential) => {
		this.setState({ [credential]: e.target.value });
	};

	handleSubmit = (e) => {
		const data = {
			username: this.state.username,
			password: this.state.password
		};
		e.preventDefault();

		fetch('http://localhost:8000/token-auth/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.hasOwnProperty('token')) {
					localStorage.setItem('token', json.token);
					localStorage.setItem('token-time', new Date());
					this.setState({ redirect: true });
				} else {
					this.setState({ errors: 'Invalid Username/Password Combination!' });
				}
			});
	};

	render() {
		if (this.state.redirect || this.isAuthenticated()) {
			return <Redirect exact to="/play"/>;
		} else {
			const errorMessage = this.state.errors;
			return (
				<div className="login_div">
					<h1>Log In</h1>
					<div className="container">
						<form className="login_form" onSubmit={this.handleSubmit}>
							Username{' '}
							<input
								name="username"
								type="text"
								onChange={(e) => this.handleCredentialChange(e, 'username')}
								required
							/>
							<br />
							Password{' '}
							<input
								className="password_login"
								name="password"
								type="password"
								onChange={(e) => this.handleCredentialChange(e, 'password')}
								required
							/>
							<br />
							<p> {errorMessage}</p>
							<button type="submit" className="btn btn-secondary">
								Log In
							</button>
						</form>
						<Link to="/signup">
							<button className="btn btn-secondary">Sign Up</button>
						</Link>
					</div>
				</div>
			);
		}
	}

	isAuthenticated() {
		return false;
	}
}

export default login;