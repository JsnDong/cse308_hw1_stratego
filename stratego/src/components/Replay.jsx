import React from 'react';
import {isEqual, matrix, matrix_includes} from "../LilacArray.js"
import {Board} from "./Board.jsx"
import {handleMove} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Replay extends React.Component {
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
                <FontAwesomeIcon icon="forward"><button onClick={this.makeMove} disabled={this.canMakeMove()}></button></FontAwesomeIcon>
                <button onClick={this.rewindMove} disabled={this.canRewindMove()}></button>
                <button onClick={this.handleReplay}></button>

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

	canMakeMove() {
		return this.state.movePtr != this.state.moves.length;
	}

	canRewindMove() {
		return this.state.movePtr != 0;
	}

	makeMove() {
		const {movePtr, board} = this.state;
		const [startMove, endMove] = this.props.moves[movePtr];
		const [startRow, startCol] = startMove;
		const [endRow, endCol] = endMove;

		const updatedBoard = handleMove(board, startRow, startCol, endRow, endCol);
		this.setState({
			board: updatedBoard,
			movePtr: movePtr + 1
		});
	}

	rewindMove() {
		const {movePtr, board} = this.state;
		const [startMove, endMove] = this.props.moves[movePtr - 1];
		const [startRow, startCol] = startMove;
		const [endRow, endCol] = endMove;

		const updatedBoard = handleMove(board, endRow, endCol, startRow, startCol);
		this.setState({
			board: updatedBoard,
			movePtr: movePtr - 1
		});
	}
}

export default Replay;