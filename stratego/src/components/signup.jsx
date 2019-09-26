import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import '../style/loginStyle.css';

class signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			username: '',
			password: '',
			errors: '',
			authenticated: false,
		};
		this.authenticate();
	}

	handleFieldChange = (e, field) => {
		this.setState({ [field]: e.target.value });
	};

	handleSignUp = (e) => {
		const user = {
			username: this.state.username,
			password: this.state.password
		};
		e.preventDefault();

		axios.post('http://localhost:8080/userPost', user).then(
			(response) => {
				console.log(response);
				this.setState({ redirect: true });
			},
			(error) => {
				this.setState({ 
					errors: 'Error signing up! Try a different username',
					username: '',
					password: '',
				});
			}
		);
	}

	render() {

		if (this.state.authenticated) {
			return <Redirect exact to="/play"/>;
		}
		if (this.state.redirect) {
			return <Redirect exact to="/login" />;
		} else {
			const errorMessage = this.state.errors;
			return (
				<div className="Signup">
					<div className="box-container"> 
					<h1 className="Title">Sign Up</h1>
						<form className="signup_form" onSubmit={this.handleSignUp}>
							<FormGroup controlId="formBasicText" bsSize="large">
								<FormControl
								autoFocus
								type="text"
								placeholder="Username"
								onChange={(e) => this.handleFieldChange(e, 'username')}
								required
								/>
							</FormGroup>
							<FormGroup controlId="password" bsSize="large">
								<FormControl
								onChange={(e) => this.handleFieldChange(e, 'password')}
								type="password"
								placeholder="Password"
								required
								/>
							</FormGroup>
							<FormGroup controlId="password" bsSize="large">
								<FormControl
								name="confirm_password"
								onChange={(e) => this.handleFieldChange(e, 'confirm_password')}
								type="password"
								placeholder="Confirm Password"
								required
								/>
							</FormGroup>
							<p style={{ color: 'red' }}> {errorMessage}</p>
							<Button
								block
								bsSize="large"
								type="submit"
							>
								Submit
							</Button>
						</form>
					</div>
				</div>
			);
		}
	}
	authenticate() {
		if (!localStorage.hasOwnProperty('token')) {
			return false;
		}
		console.log(localStorage.getItem('token'));
		axios.post('http://localhost:8080/token-auth', localStorage.getItem('token')).then(
			(res) => {
				if (res.data) {
					this.setState({authenticated: true});
				}
			},
		);
	}
}

export default signup;