import React from 'react';
import { isEqual, matrix, matrix_includes } from '../LilacArray.js';
import { handleMove } from '../game/validation.js';
import Move from '../Move.js';
import MoveHistory from './MoveHistory.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import ReplayBoard from './ReplayBoard.jsx';
import Board from '../Board.js';
import Tile from '../Tile.js';
import Piece from '../Piece.js';
import { Redirect } from 'react-router-dom';
import '../stylesheets/replayBoard.css';

class Replay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			errors: null,
			board: null,
			moves: []
		};
		this.getGameInfo();
	}

	render() {
		if (this.state.loading) {
			return null;
		}

		if (this.state.errors) {
			return <Redirect to="/404" />;
		}

		return <ReplayBoard board={this.state.board} moves={this.state.moves} />;
	}

	getGameInfo() {
		const { id } = this.props.match.params;

		axios.get('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/getGame/' + id).then(
			(res) => {
				const { moveListDe, startListDe } = res.data;
				const initialBoard = new Board(10);
				initialBoard.board = this.parseBoard(JSON.parse(startListDe));
				const moves = this.parseMoves(JSON.parse(moveListDe));
				console.log(initialBoard);
				console.log(moves);
				this.setState({
					loading: false,
					board: initialBoard,
					moves: moves.reverse() // want to play the game from the beginning
				});
			},
			(err) => {
				this.setState({
					loading: false,
					errors: err
				});
			}
		);
	}

	parseBoard(startBoard) {
		return startBoard.map((row) => {
			return row.map((tile) => {
				return this.parseTile(tile);
			});
		});
	}

	parseMoves(moves) {
		return moves.map((move) => {
			const startTile = this.parseTile(move.startTile);
			const targetTile = this.parseTile(move.targetTile);
			return new Move(startTile, targetTile);
		});
	}

	parseTile(tile) {
		const newTile = new Tile(tile.row, tile.col);
		newTile.piece = this.parsePiece(tile.piece);
		return newTile;
	}

	parsePiece(piece) {
		if (piece === null) {
			return null;
		}
		const copiedPiece = new Piece(piece.color, piece.rank);
		copiedPiece.revealed = true;
		return copiedPiece;
	}
}

export default Replay;
