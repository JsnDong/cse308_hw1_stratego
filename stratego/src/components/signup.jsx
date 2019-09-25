import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			username: '',
			password: '',
			errors: ''
		};
	}

	handleFieldChange = (e, field) => {
		this.setState({ [field]: e.target.value });
	};

	handleSignUp = (e) => {
		const data = {
			username: this.state.username,
			password: this.state.password
		};
		e.preventDefault();

		fetch('http://localhost:8000/signup/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.hasOwnProperty('token')) {
					this.setState({ redirect: true });
				} else {
					this.setState({ errors: 'Error signing up! Try a different username' });
				}
			});
	}

	render() {
		if (this.isAuthenticated()) {
			return <Redirect exact to="/play"/>;
		}
		if (this.state.redirect) {
			return <Redirect exact to="/login"/>;
		} 

		const errorMessage = this.state.errors;
		return (
			<div className="container">
				<h1>Sign Up</h1>
				<div>
					<form className="signup_form" onSubmit={this.handleSubmit}>
						Username
						<input
							name="username"
							type="text"
							onChange={(e) => this.handleFieldChange(e, 'username')}
							required
						/>
						<br />
						Password
						<input
							name="password"
							type="password"
							onChange={(e) => this.handleFieldChange(e, 'password')}
							required
						/>
						<br />
						Confirm Password
						<input
							name="confirm_password"
							type="password"
							onChange={(e) => this.handleFieldChange(e, 'confirm_password')}
							required
						/>
						<br />
						<p style={{ color: 'white' }}> {errorMessage}</p>
						<button type="submit" className="btn btn-secondary">
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default signup;