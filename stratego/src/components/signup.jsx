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

	render() {
		if (this.state.redirect) {
			return <Redirect exact to="/login" />;
		} else {
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
}

export default signup;