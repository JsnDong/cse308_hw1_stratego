import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import PieChart from 'react-minimal-pie-chart';
import '../stylesheets/accountStyle.css';
import Background from '../stylesheets/gameBackGround.jpg';
import { Line } from 'rc-progress';

class account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username,
			win: 0,
			lose: 0,
			draw: 0,
			avgTime: '',
			data : [true, false, false, false],
		};
	}

	handleLogOut() {
		localStorage.removeItem('token');
	}

	componentDidMount = () => {
		this.getInfo();
	};

	getInfo = () => {
		axios.get('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/getInfo/' + this.state.username).then(
			(res) => {
				console.log(res);
				this.setState({
					win: res.data.totalWin,
					lose: res.data.totalLose,
					draw: res.data.totalTie,
					avgTime: res.data.averageTime
				});
			},
			(err) => {
				console.log(err);
			}
		);
	}

	handleMouseOver = (event, data, dataIndex) => {
		let newData =[false, false, false, false];
		newData[dataIndex] = true;
		this.setState({ data : newData });
	};

	render() {
		let average = '0.00';
		let wins = 0;
		let losses = 0;
		let draws  = 0;
		const { win, lose, draw, avgTime} = this.state
		if(!avgTime.includes('NaN')) {
			average = avgTime;
		}

		console.log({win, lose, draw, avgTime});
		const winRatio = [
			{ label: '', title: 'Wins', value: parseInt(wins), color: '#B385C8' },
			{ label: '', title: 'Losses', value: parseInt(losses), color: '#7566BD' },
			{ title: 'Draws', value: parseInt(draws), color: '#9CADC1' },
		];
		let total = 0;
		Array.from(winRatio).forEach((data, i) => {
			total += data.value;
		});
		if(total !== 0) {
			wins = Math.round((parseFloat((winRatio[0].value))/parseFloat(total))*100);
			losses = Math.round((parseFloat((winRatio[1].value))/parseFloat(total))*100);
			draws = Math.round((parseFloat((winRatio[2].value))/parseFloat(total))*100);
		}


		return (
			<div className="info" >
				<h2> {this.state.mode} </h2>
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
					{ this.state.data[0] ? <h1>{ winRatio[0].title + ': ' + wins + '%' + ' (' + (winRatio[0].value) + '/' + total + ')'}</h1> : null }
					{ this.state.data[1] ? <h1>{ winRatio[1].title + ': ' + losses + '%' + ' (' + (winRatio[1].value) + '/' + total + ')'}</h1> : null }
					{ this.state.data[2] ? <h1>{ winRatio[2].title + ': ' + draws + '%' + ' (' + (winRatio[2].value) + '/' + total + ')'}</h1> : null }
					</div>
					<div className="column">
						<div className="winRateBox">
							<h1> Win Rate </h1>
							<h3>{wins + '%' + ' (' + (winRatio[0].value) + '/' + total + ')'}</h3>
							<Line style={{width: 250, paddingTop: 20}}percent={Math.floor((winRatio[0].value/total)*100)} strokeWidth="4" strokeColor='#7566BD' />
						</div>
						<div className="space" >

						</div>
						<div className="gameTimeBox">
							<h1> Average Game Time </h1>
							<h3> {average} min</h3>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default account;
