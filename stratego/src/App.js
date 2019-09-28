import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './stylesheets/App.css';

import Login from './components/login.jsx';
import SignUp from './components/signup.jsx';
import Account from './components/account.jsx';
import Stratego from './components/Stratego.jsx';
import Replay from './components/Replay.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import NoMatch from './components/noMatch.jsx';
import Games from './components/games.jsx';

import Test from './components/test.jsx';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Switch>
						<Route exact path="/" component={Login} />
						<Route exact path="/login" component={Login} />
						<PrivateRoute exact path="/play" component={Stratego} />
						<Route exact path="/signup" component={SignUp} />
						<PrivateRoute exact path="/account" component={Account} />
						<Route exact path="/replay" component={Replay} />
						<PrivateRoute exact path="/games" component={Games} />
						<Route exact path="/test" component={Test} />
						<Route component={NoMatch} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
