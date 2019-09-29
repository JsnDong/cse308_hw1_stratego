import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PieChart from 'react-minimal-pie-chart';
import '../stylesheets/accountStyle.css';
import Background from '../stylesheets/gameBackGround.jpg';
import { Line } from 'rc-progress';

class account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : [true, false, false, false],
			username : 'James'
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
			{ label: '', title: 'Wins', value: 35, color: '#B385C8' },
			{ label: '', title: 'Losses', value: 15, color: '#7566BD' },
			{ title: 'Draws', value: 5, color: '#9CADC1' },
		];
		let total = 0;
		Array.from(winRatio).forEach((data, i) => {
			total += data.value;
		});

		return (
			<div className="info" >
				<div className="header">
					<div className="greeting">
						Hi, {this.state.username}
					</div>
					<h5 className="pipe">|</h5>
					<Link to="/play" className="links">
						Play!
					</Link>
					<h5 className="pipe">|</h5>
					<Link to="/games" className="links">
						Game History
					</Link>
					<h5 className="pipe">|</h5>
					<Link to="/login" className="links" onClick={this.handleLogOut}>
						Sign Out
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
					{ this.state.data[0] ? <h1>{ winRatio[0].title + ': ' + Math.round(((winRatio[0].value)/total)*100) + '%' + ' (' + (winRatio[0].value) + '/' + total + ')'}</h1> : null }
					{ this.state.data[1] ? <h1>{ winRatio[1].title + ': ' + Math.round(((winRatio[1].value)/total)*100) + '%' + ' (' + (winRatio[1].value) + '/' + total + ')'}</h1> : null }
					{ this.state.data[2] ? <h1>{ winRatio[2].title + ': ' + Math.round(((winRatio[2].value)/total)*100) + '%' + ' (' + (winRatio[2].value) + '/' + total + ')'}</h1> : null }
					</div>
					<div className="column">
						<div className="winRateBox">
							<h1> Win Rate </h1>
							<h3> 70% (35/50)</h3>
							<Line style={{width: 250, paddingTop: 20}}percent={Math.floor((winRatio[0].value/total)*100)} strokeWidth="4" strokeColor='#7566BD' />
						</div>
						<div className="space" >

						</div>
						<div className="gameTimeBox">
							<h1> Average Game Time </h1>
							<h3> 25:00 </h3>
						</div>
					</div>

				</div>
			</div>
		);
	}
}
export default account;
