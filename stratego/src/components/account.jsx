import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PieChart from 'react-minimal-pie-chart';
import '../stylesheets/accountStyle.css';

class account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : [false, false, false, false]
		};
	}
	handleLogOut() {
		localStorage.removeItem('token');
	}

	handleMouseOver = (event, data, dataIndex) => {
		console.log(data);
		console.log(dataIndex);
		let newData =[false, false, false, false];
		newData[dataIndex] = true;
		this.setState({ data : newData });
	};

	render() {
		const winRatio = [
			{ title: 'Wins', value: 35, color: '#0d8a9c' },
			{ title: 'Lossess', value: 15, color: '#f64f4f' },
			{ title: 'Surrenders', value: 2, color: '#18b5cc' },
			{ title: 'Draws', value: 1, color: '#878787' },
		];

		return (
			<div className="info">
				<div className="header">
					<h1 classname="title">Hi, JamesAngeles! </h1>
					<Link to="/play">
						<h1>Play!</h1>
					</Link>
					<Link to="/games" >
						<h1>Past Games</h1>
					</Link>
					<Link to="/login">
						<button onClick={this.handleLogOut}>Sign out</button>
					</Link>
				</div>
				<div className="row">
				<div className="pieChartBox">
					<PieChart
						onMouseOver={(event, data, dataIndex) => {this.handleMouseOver(event, data, dataIndex)}}
						label="Wins/Losses"
						labelStyle={{color: 'black'}}
						style={{width: 200, height: 200}}
						data={winRatio}
						/>
					{ this.state.data[0] ? <h1>{ winRatio[0].title + ': ' + winRatio[0].value + '%'}</h1> : null }
					{ this.state.data[1] ? <h1>{ winRatio[1].title + ': ' + winRatio[1].value + '%'}</h1> : null }
					{ this.state.data[2] ? <h1>{ winRatio[2].title + ': ' + winRatio[2].value + '%'}</h1> : null }
					{ this.state.data[3] ? <h1>{ winRatio[3].title + ': ' + winRatio[3].value + '%'}</h1> : null }
					</div>
					<div className="column">
						<div className="winRateBox">
							<h3> Win Rate: 70% (35/50) </h3>
						</div>
						<div className="gameTimeBox">
							<h2> Average Game Time: 25:00 </h2>
						</div>
					</div>

				</div>
			</div>
		);
	}
}
export default account;
