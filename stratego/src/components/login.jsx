import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, ControlLabel } from 'react-bootstrap';
import axios from 'axios';
import '../stylesheets/loginStyle.scss';
import titleTxt from '../stylesheets/StrategoTitle.svg';

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
		const user = {
			username: this.state.username,
			password: this.state.password
		};
		e.preventDefault();

		axios.post('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/users', user).then(
			(res) => {
				console.log(res);
				localStorage.setItem('token', res.data);
				this.setState({ redirect: true });
			},
			(err) => {
				console.log('log');
				this.setState({
					errors: 'Invalid Username/Password Combination!'
				});
			}
		);
	};

	componentWillMount() {
		this.redirectIfAuthenticated();
	}

	render() {
		if (this.state.redirect) {
			return <Redirect exact to="/play" />;
		} else {
			const errorMessage = this.state.errors;
			return (
				<div className="stratego">
				<div className="Login" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '90vh'}}>
					<div className="box-container">
						<img style={{height: 100, width: '100%' }}src={titleTxt} />
						<h1 className="formTitle">Log In</h1>
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
							<p style={{ color: 'red' }}> {errorMessage}</p>
							<Button style={{ backgroundColor: '#7566BD' }} block bsSize="large" type="submit">
								Login
							</Button>
							<Link to="/signup">
								<button className="signup-btn">Sign Up</button>
							</Link>
						</form>
					</div>
				</div>
				</div>
			);
		}
	}

	redirectIfAuthenticated() {
		if (!localStorage.hasOwnProperty('token')) {
			return false;
		}
		axios
			.post(
				'http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/token-auth',
				localStorage.getItem('token')
			)
			.then(
				(res) => {
					if (res.data) {
						this.setState({ redirect: true });
					}
				},
				(err) => {
					console.log(err);
				}
			);
	}
}

export default login;
