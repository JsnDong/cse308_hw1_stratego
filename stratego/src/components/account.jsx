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
			loading: true,
			win: 0,
			lose: 0,
			draw: 0,
			avgTime: '',
			data: [ true, false, false, false ]
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
					loading: false,
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
	};

	handleMouseOver = (event, data, dataIndex) => {
		let newData = [ false, false, false, false ];
		newData[dataIndex] = true;
		this.setState({ data: newData });
	};

	render() {
		if (this.state.loading) {
			return null;
		}
		let average = '0:00';
		const { win, lose, draw, avgTime } = this.state;
		if (!avgTime.includes('NaN')) {
			average = this.parseTime(avgTime);
		}

		console.log({ win, lose, draw, avgTime });
		const winRatio = [
			{ label: '', title: 'Wins', value: parseInt(win), color: '#B385C8' },
			{ label: '', title: 'Losses', value: parseInt(lose), color: '#7566BD' },
			{ title: 'Draws', value: parseInt(draw), color: '#9CADC1' }
		];
		let total = 0;
		Array.from(winRatio).forEach((data, i) => {
			total += data.value;
		});
		let percentWins = 0;
		let percentLosses = 0;
		let percentDraws = 0;
		if (total !== 0) {
			percentWins = Math.round(parseFloat(winRatio[0].value) / parseFloat(total) * 100);
			percentLosses = Math.round(parseFloat(winRatio[1].value) / parseFloat(total) * 100);
			percentDraws = Math.round(parseFloat(winRatio[2].value) / parseFloat(total) * 100);
		}

		return (
			<div className="info">
				<h2> {this.state.mode} </h2>
				<div className="header">
					<div className="greeting">Hi, {this.state.username}</div>
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
							onMouseOver={(event, data, dataIndex) => {
								this.handleMouseOver(event, data, dataIndex);
							}}
							label="Wins/Losses"
							labelStyle={{ color: 'black' }}
							style={{ width: 200, height: 200 }}
							data={winRatio}
						/>
						{this.state.data[0] ? (
							<h1>
								{winRatio[0].title +
									': ' +
									percentWins +
									'%' +
									' (' +
									winRatio[0].value +
									'/' +
									total +
									')'}
							</h1>
						) : null}
						{this.state.data[1] ? (
							<h1>
								{winRatio[1].title +
									': ' +
									percentLosses +
									'%' +
									' (' +
									winRatio[1].value +
									'/' +
									total +
									')'}
							</h1>
						) : null}
						{this.state.data[2] ? (
							<h1>
								{winRatio[2].title +
									': ' +
									percentDraws +
									'%' +
									' (' +
									winRatio[2].value +
									'/' +
									total +
									')'}
							</h1>
						) : null}
					</div>
					<div className="column">
						<div className="winRateBox">
							<h1> Win Rate </h1>
							<h3>{percentWins + '%' + ' (' + winRatio[0].value + '/' + total + ')'}</h3>
							<Line
								style={{ width: 250, paddingTop: 20 }}
								percent={Math.floor(winRatio[0].value / total * 100)}
								strokeWidth="4"
								strokeColor="#7566BD"
							/>
						</div>
						<div className="space" />
						<div className="gameTimeBox">
							<h1> Average Game Time </h1>
							<h3> {average}</h3>
						</div>
					</div>
				</div>
			</div>
		);
	}

	parseTime = (time) => {
		const parsedTime = time.split('.')[0].split(':');
		let minutes = parsedTime[0];
		minutes = minutes.length >= 2 ? minutes : '0' + minutes[0];
		return minutes + ':' + parsedTime[1];
	};
}
export default account;
