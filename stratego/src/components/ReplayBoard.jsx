import React from 'react';
import {isEqual, matrix, matrix_includes} from "../LilacArray.js"
import {Board} from "./Board.jsx"
import {handleMove} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

class ReplayBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initialBoard: props.board.copy(),
			currentMoves: [],
			board: props.board,
			movePtr: 0,
		}
	}

	render() {
		return (
			<div className="stratego">
                <button onClick={this.rewindMove} disabled={!this.canRewindMove()}>Rewind</button>
                <button onClick={this.makeMove} disabled={!this.canMakeMove()}>Forward</button>
                <button onClick={this.replayGame}>Replay</button>
                <Link to ="/account"><button>Profile</button></Link>

                {<Board disabled={true}
                		mode={this.state.mode}
                        board={this.state.board}
                        selected={this.state.selected}
                        highlighted={this.state.highlighted}
                        selectTile={this.selectTile}
                        />}
                <div className="feed">
                    {<MoveHistory moves={this.state.currentMoves}/>}
                </div> 
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
		const currentMove = this.props.moves[movePtr];
		const {startTile, targetTile} = currentMove;
		this.state.currentMoves.push(currentMove);

		const {winner} = handleMove(startTile.piece,targetTile);
		board.board[targetTile.row][targetTile.col].piece = winner;
		board.board[startTile.row][startTile.col].piece = null;

		this.setState({
			board: board,
			movePtr: movePtr + 1
		});
	}

	rewindMove = (e) => {
		const {movePtr, board} = this.state;
		const {startTile, targetTile} = this.props.moves[movePtr - 1];
		this.state.currentMoves.shift();

		board.board[targetTile.row][targetTile.col].piece = targetTile.piece;
		board.board[startTile.row][startTile.col].piece = startTile.piece;
		this.setState({
			board: board,
			movePtr: movePtr - 1
		});
	}

	replayGame = (e) => {
		const initialBoard = this.state.initialBoard;
		const copy = initialBoard.copy();
		this.setState({
			currentMoves: [],
			movePtr: 0,
			board: initialBoard,
			initialBoard: copy,
		});
	}
}

export default ReplayBoard;