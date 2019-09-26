import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, ControlLabel } from "react-bootstrap";
import '../style/loginStyle.css';

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
					<div className="Login">
					<div className="box-container"> 
					<h1 className="Title">Log In</h1>
						<form className="login_form" onSubmit={this.handleSubmit}>
							<FormGroup controlId="formBasicText" bsSize="large">
								<FormControl
								autoFocus
								type="text"
								placeholder="Username"
								onChange={(e) => this.handleCredentialChange(e, 'username')}
								required
								/>
							</FormGroup>
							<FormGroup controlId="password" bsSize="large">
								<FormControl
								onChange={(e) => this.handleCredentialChange(e, 'password')}
								type="password"
								placeholder="Password"
								required
								/>
							</FormGroup>
							<p> {errorMessage}</p>
							<Button
								block
								bsSize="large"
								type="submit"
							>
								Login
							</Button>
							<Link to="/sign_up">
								<button className="signup-btn" >Sign Up</button>
							</Link>
						</form>
<<<<<<< HEAD
						</div>
=======
						<Link to="/signup">
							<button className="btn btn-secondary">Sign Up</button>
						</Link>
>>>>>>> 8c1290902763d68a7a49d54d5bc8ac83120e1b8d
					</div>
					
			);
		}
	}

	isAuthenticated() {
		return false;
	}
}

export default login;