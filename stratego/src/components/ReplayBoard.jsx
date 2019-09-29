import React from 'react';
import {isEqual, matrix, matrix_includes} from "../LilacArray.js"
import {Board} from "./Board.jsx"
import {handleMove} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ReplayBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board: props.board,
			movePtr: 0,
		}
	}

	render() {
		return (
			<div className="stratego">
                <button onClick={this.rewindMove} disabled={!this.canRewindMove()}>Rewind</button>
                <button onClick={this.makeMove} disabled={!this.canMakeMove()}>Forward</button>
                <button onClick={this.handleReplay}>Replay</button>

                {<Board mode= {this.state.mode}
                        board={this.state.board}
                        selected = {this.state.selected}
                        highlighted = {this.state.highlighted}
                        selectTile={this.selectTile}
                        />}
                {<MoveHistory moves={this.state.moves}/>}
            </div>
		)
	}

	canMakeMove = () => {
		return this.state.movePtr != this.props.moves.length;
	}

	canRewindMove = () => {
		return this.state.movePtr != 0;
	}

	makeMove = (e) => {
		const {movePtr, board} = this.state;
		const {startRow, startCol, endRow, endCol, startPiece, endPiece} = this.props.moves[movePtr];

		const {winner} = handleMove(startPiece,endPiece);
		board[endRow][endCol] = winner;
		board[startRow][startCol] = null;

		this.setState({
			board: board,
			movePtr: movePtr + 1
		});
	}

	rewindMove = (e) => {
		const {movePtr, board} = this.state;
		const {startRow, startCol, endRow, endCol, startPiece, endPiece} = this.props.moves[movePtr - 1];
		board[endRow][endCol] = endPiece;
		board[startRow][startCol] = startPiece;
 
		this.setState({
			board: board,
			movePtr: movePtr - 1
		});
	}
}

export default ReplayBoard;