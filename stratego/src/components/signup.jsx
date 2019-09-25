import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, ControlLabel } from "react-bootstrap";
import '../style/loginStyle.css';

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

	render() {
		if (this.state.redirect) {
			return <Redirect exact to="/login" />;
		} else {
			const errorMessage = this.state.errors;
			return (
				<div className="Signup">
					<div className="box-container"> 
					<h1 className="Title">Sign Up</h1>
						<form className="signup_form" onSubmit={this.handleSubmit}>
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
							<p style={{ color: 'white' }}> {errorMessage}</p>
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
}

export default signup;