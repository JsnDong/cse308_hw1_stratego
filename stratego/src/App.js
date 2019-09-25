import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './stylesheets/App.css';

import Login from './components/login.jsx';
import SignUp from './components/signup.jsx';
import Account from './components/account.jsx';
import Stratego from './components/Stratego.jsx';


class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Switch>
						<Route exact path="/" component={Login}/>
						<Route exact path="/login" component={Login}/>
						<Route exact path="/play" component={Stratego}/>
						<Route exact path="/signup" component={SignUp}/>
						<Route exact path="/account" component={Account}/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
