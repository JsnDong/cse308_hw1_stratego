import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import '../stylesheets/loginStyle.scss';
import titleTxt from '../stylesheets/StrategoTitle.svg';

class signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			username: '',
			password: '',
			errors: '',
			authenticated: false
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

		axios.post('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/userPost', user).then(
			(response) => {
				console.log(response);
				this.setState({ redirect: true });
			},
			(error) => {
				this.setState({
					errors: 'Error signing up! Try a different username',
					username: '',
					password: ''
				});
			}
		);
	};

	render() {
		if (this.state.authenticated) {
			return <Redirect exact to="/play" />;
		}
		if (this.state.redirect) {
			return <Redirect exact to="/login" />;
		} else {
			const errorMessage = this.state.errors;
			return (
				<div className="stratego">
				<div className="Signup" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
					<div className="box-container">
						<img style={{height: 100, width: '100%' }}src={titleTxt} />
						<h3> Sign up </h3>
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
							<p style={{ color: 'red' }}> {errorMessage}</p>
							<Button style={{ backgroundColor: '#7566BD' }} block bsSize="large" type="submit">
								Sign Up
							</Button>
						</form>
					</div>
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
		axios
			.post(
				'http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/token-auth',
				localStorage.getItem('token')
			)
			.then((res) => {
				if (res.data) {
					this.setState({ authenticated: true });
				}
			});
	}
}

export default signup;
