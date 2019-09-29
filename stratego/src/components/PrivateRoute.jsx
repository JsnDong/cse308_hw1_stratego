import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


class PrivateRoute extends React.Component {

	constructor(props) {
		super(props);
		this.state =  {
			loading: true,
			isAuthenticated: false,
			username: ''
		};
	}

	componentDidMount() {
		this.authenticate();
	}


	render() {
		if (this.state.loading) {
			return null;
		}
		if (!this.state.isAuthenticated) {
			return <Redirect exact to="/login"/>;
		}
		const Component = this.props.component;
		return (
			<Component {...this.props} username={this.state.username}/>
		);
	}

	authenticate() {
		if (!localStorage.hasOwnProperty('token')) {
			this.setState({
				loading: false,
			});
		}
		axios.post('http://localhost:8080/token-auth', localStorage.getItem('token')).then(
			(res) => {
				this.setState({
					loading: false,
					isAuthenticated: true,
					username: res.data,
				});
			},
			(err) => {
				this.setState({
					loading: false,
				});
			}
		); 
	}
}

export default PrivateRoute;