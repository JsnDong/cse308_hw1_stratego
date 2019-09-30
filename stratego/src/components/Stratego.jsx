import React from 'react';
import { matrix_includes, matrix } from '../LilacArray.js';
import { Board as BoardComponent } from './Board.jsx';
import MoveHistory from './MoveHistory.jsx';
import { Scoreboard } from './Scoreboard.jsx';
import Stopwatch from './stopwatch.jsx';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

import Mode from '../Mode.js';
import Move from '../Move.js';
import Color from '../Color.js';
import Rank from '../Rank.js';
import Board from '../Board.js';
import Tile from '../Tile.js';

class Stratego extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initialBoard: null,
			board: new Board(DIMENSION),
			scoreboard: this.setScoreboard(),
			duration: null,
			username: props.username
		};
		this.selectTile = this.selectTile.bind(this);

		this.handleShuffle = this.handleShuffle.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleSurrender = this.handleSurrender.bind(this);
		this.handlePlayAgain = this.handlePlayAgain.bind(this);
		this.handleDraw = this.handleDraw.bind(this);
		this.handleWin = this.handleWin.bind(this);
		this.handleTest = this.handleTest.bind(this);
		this.handleAutomove = this.handleAutomove.bind(this);
	}

	setScoreboard() {
		const ranks = Object.keys(Rank.properties);
		const header = [ 'Pieces', 'Blue', 'Red' ];

		let scoreboard = [ header ];

		let scoreboard_row;
		ranks.forEach((rank) => {
			scoreboard_row = [];
			scoreboard_row.push(rank);
			scoreboard_row.push(Rank.properties[rank].quantity);
			scoreboard_row.push(Rank.properties[rank].quantity);
			scoreboard.push(scoreboard_row);
		});

		return scoreboard;
	}

	updateScoreboard(color, rank) {
		const color_index = color === Color.BLUE ? 1 : 2;
		const rank_index = Rank.properties[rank].power + 1;

		let scoreboard = this.state.scoreboard;
		scoreboard[rank_index][color_index] = scoreboard[rank_index][color_index] - 1;

		this.setState({
			scoreboard: scoreboard
		});
	}

	startStopwatch() {
		const start_time = Date.now() - this.state.duration;
		const tick = () => {
			this.setState({
				duration: Date.now() - start_time
			});
		};
		this.stopwatch = setInterval(tick);
	}

	stopStopwatch() {
		clearInterval(this.stopwatch);
	}

	handleShuffle() {
		this.setState({
			board: new Board(DIMENSION)
		});
	}

	handleStart() {
		const { board } = this.state.board;
		let deepTiles = matrix(DIMENSION);
		for (let row = 0; row < DIMENSION; row++) {
			for (let col = 0; col < DIMENSION; col++) {
				const tile = board[row][col];
				deepTiles[row][col] = new Tile(tile.row, tile.col);
				deepTiles[row][col].piece = tile.piece;
			}
		}
		console.log(deepTiles);
		this.state.board.setMode(Mode.PLAY);
		this.state.board.unselect();
		this.setState({
			initialBoard: deepTiles,
			board: this.state.board,
			duration: 0
		});
		this.startStopwatch();
	}

	isGameOver() {
		const board = this.state.board;
		if (board.getMode() === Mode.SETUP || board.getMode() === Mode.PLAY || board.getMode() === Mode.TEST) {
			return false;
		}
		this.stopStopwatch();
		let winLose;

		if (board.getMode() == Mode.LOST) winLose = 0;
		else if (board.getMode() == Mode.WON) winLose = 1;
		else if (board.getMode() == Mode.DRAW) winLose = 2;

		const timer = this.state.duration;
		const minutes = Math.floor(timer / 1000 / 60);
		const seconds = Math.floor((timer / 1000) % 60);

		let display;
		if (minutes < 10 && seconds < 10) {
			display = '0' + minutes + ':0' + seconds;
		} else if (minutes < 10) {
			display = '0' + minutes + ':' + seconds;
		} else {
			display = +minutes + ':' + seconds;
		}
		console.log(display);

		const game = {
			username: this.state.username,
			winLose: winLose,
			time: display,
			moveList: this.state.board.getMoves(),
			startList: this.state.initialBoard
		};

		axios.post('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/createGame', game).then(
			(res) => {
				console.log(res);
			},
			(err) => {}
		);
	}

	handleSurrender() {
		let board = this.state.board;
		board.setMode(Mode.LOST);
		this.setState({
			board: board
		});
		this.isGameOver();
	}

	handleDraw() {
		let board = this.state.board;
		board.setMode(Mode.DRAW);
		this.setState({
			board: board
		});
		this.isGameOver();
	}

	handleWin() {
		let board = this.state.board;
		board.setMode(Mode.WON);
		this.setState({
			board: board
		});
		this.isGameOver();
	}

	handleLogOut() {
		localStorage.removeItem('token');
	}

	handlePlayAgain() {
		this.setState({
			board: new Board(DIMENSION),
			scoreboard: this.setScoreboard(),
			duration: 0
		});
	}

	handleTest() {
		let board = this.state.board;
		if (board.getMode() !== Mode.TEST) {
			board.setMode(Mode.TEST);
			this.setState({
				board: board
			});
		} else {
			this.handlePlayAgain();
		}
	}

	handleAutomove() {
		let board = this.state.board;
		let scoreboard = this.state.scoreboard;
		const red_move = board.autoMove(Color.RED);
		board.applyMove(red_move, scoreboard);
		board.addMove(red_move);
		if (board.hasLost(Color.RED, scoreboard) && board.hasLost(Color.RED, scoreboard)) {
			board.setMode(Mode.DRAW);
		} else if (board.hasLost(Color.RED, scoreboard)) {
			board.setMode(Mode.LOST);
		} else if (board.hasLost(Color.BLUE, scoreboard)) {
			board.setMode(Mode.WON);
		}
		board.nextTurn();
		const blue_move = board.autoMove(Color.BLUE);
		board.applyMove(blue_move, scoreboard);
		board.addMove(blue_move);
		if (board.hasLost(Color.RED, scoreboard) && board.hasLost(Color.RED, scoreboard)) {
			board.setMode(Mode.DRAW);
		} else if (board.hasLost(Color.RED, scoreboard)) {
			board.setMode(Mode.LOST);
		} else if (board.hasLost(Color.BLUE, scoreboard)) {
			board.setMode(Mode.WON);
		}
		board.nextTurn();
		this.setState({
			board: board,
			scoreboard: scoreboard
		});
	}

	selectTile(row, col) {
		let board = this.state.board;
		let scoreboard = this.state.scoreboard;

		const mode = board.getMode();
		const clicked_piece = board.getTile(row, col).getPiece();

		if (mode === Mode.SETUP && clicked_piece && clicked_piece.getColor() !== Color.BLUE) {
			if (!board.getSelected()) {
				board.setSelected(row, col);
			} else if (board.getSelected().isEqual(board.getTile(row, col))) {
				board.unselect();
			} else if (board.getSelected()) {
				board.getTile(row, col).setPiece(board.getSelected().getPiece());
				board.getSelected().setPiece(clicked_piece);
				board.unselect();
			}

			this.setState({
				board: board
			});
		} else if (mode === Mode.PLAY) {
			if (!board.getSelected() && clicked_piece && clicked_piece.getColor() === board.getTurn()) {
				board.setSelected(row, col);
				this.setState({
					board: board
				});
			} else if (board.getSelected() && board.getSelected().isEqual(board.getTile(row, col))) {
				board.unselect();
				this.setState({
					board: board
				});
			} else if (board.getSelected() && board.getReachable().includes(board.getTile(row, col))) {
				let start_tile = board.getSelected();
				let target_tile = board.getTile(row, col);
				const red_move = new Move(start_tile, target_tile);

				board.applyMove(red_move, scoreboard);
				board.addMove(red_move);
				board.nextTurn();

				if (board.hasLost(Color.RED, scoreboard) && board.hasLost(Color.RED, scoreboard)) {
					board.setMode(Mode.DRAW);
				} else if (board.hasLost(Color.RED, scoreboard)) {
					board.setMode(Mode.LOST);
				} else if (board.hasLost(Color.BLUE, scoreboard)) {
					board.setMode(Mode.WON);
				}

				const blue_move = board.autoMove(Color.BLUE);
				board.applyMove(blue_move, scoreboard);
				board.addMove(blue_move);
				board.nextTurn();

				if (board.hasLost(Color.RED, scoreboard) && board.hasLost(Color.RED, scoreboard)) {
					board.setMode(Mode.DRAW);
				} else if (board.hasLost(Color.RED, scoreboard)) {
					board.setMode(Mode.LOST);
				} else if (board.hasLost(Color.BLUE, scoreboard)) {
					board.setMode(Mode.WON);
				}

				this.setState({
					board: board,
					scoreboard: scoreboard
				});

				this.isGameOver();
			}
		}
	}

	render() {
		const board = this.state.board;
		const mode = board.getMode();
		let shuffle_disabled = mode !== Mode.SETUP;
		let start_disabled = mode !== Mode.SETUP;
		let surrender_disabled = mode !== Mode.PLAY;
		let playAgain_disabled = mode !== Mode.WON && mode !== Mode.LOST && mode !== Mode.DRAW;
		let automove_disabled = mode !== Mode.PLAY;
		let test_mode_disabled = mode === Mode.PLAY;

		let shuffleBtnColor = shuffle_disabled ? 'grey' : '';
		let startbtn_disabled = start_disabled ? 'grey' : '';
		let surrenderbtn_disabled = surrender_disabled ? 'grey' : '';
		let playAgainbtn_disabled = playAgain_disabled ? 'grey' : '';
		let automoveBtn_disabled = automove_disabled ? 'grey' : '';

		return (
			<div className="stratego">
				<div className="header">
					<Link to="/account" className="links">
						Profile
					</Link>
					<h5 className="pipe">|</h5>
					<Link to="/login" className="links" onClick={this.handleLogOut}>
						Sign Out
					</Link>
				</div>
				<div className="row">
					<div className="column">
						<div className="links" style={{ fontSize: 50 }}>
							<h2> {this.state.board.getMode()} </h2>
							{<Stopwatch duration={this.state.duration} />}
						</div>

						{<Scoreboard scoreboard={this.state.scoreboard} className="scoreboard" />}
					</div>
					<div className="boardCard">
						{<BoardComponent board={this.state.board} selectTile={this.selectTile} />}
					</div>
					<div className="column">
						<div className="subColumn">
							<div className="header-btn">
								<button
									className="links"
									style={{
										color: shuffleBtnColor,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleShuffle}
									disabled={shuffle_disabled}
								>
									Shuffle
								</button>
								<h5 className="pipe">|</h5>
								<button
									className="links"
									style={{
										color: startbtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleStart}
									disabled={start_disabled}
								>
									Start
								</button>
								<h5 className="pipe">|</h5>
								<button
									style={{
										color: automoveBtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleAutomove}
									disabled={automove_disabled}
								>
									Automove
								</button>
								<h5 className="pipe">|</h5>
								<button
									className="links"
									style={{
										color: surrenderbtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleWin}
									disabled={surrender_disabled}
								>
									Win
								</button>
								<h5 className="pipe">|</h5>
								<button
									className="links"
									style={{
										color: surrenderbtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleDraw}
									disabled={surrender_disabled}
								>
									Draw
								</button>
								<h5 className="pipe">|</h5>
								<button
									className="links"
									style={{
										color: surrenderbtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handleSurrender}
									disabled={surrender_disabled}
								>
									Surrender
								</button>
								<h5 className="pipe">|</h5>
								<button
									className="links"
									style={{
										color: playAgainbtn_disabled,
										borderColor: 'transparent',
										backgroundColor: 'transparent'
									}}
									onClick={this.handlePlayAgain}
									disabled={playAgain_disabled}
								>
									Play Again
								</button>
							</div>
							<div className="feed">{<MoveHistory moves={this.state.board.getMoves()} />}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const DIMENSION = 10;

export default Stratego;
