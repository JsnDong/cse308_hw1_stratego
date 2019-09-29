import React from 'react';
import {isEqual, matrix, matrix_includes} from "../LilacArray.js"
import {Board} from "./Board.jsx"
import {handleMove} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import ReplayBoard from './ReplayBoard.jsx';


class Replay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			errors: null,
			board: null,
			moves: [],
		}
		this.getGameInfo();
	}

	render() {
		if (this.state.loading) {
			return null;
		}

		if (this.state.errors) {
			return ( 
				<div> <h1> Game does not exist! </h1> </div>
			);
		}

		return <ReplayBoard board={this.state.board} moves={this.state.moves}/>;
	}

	getGameInfo() {
		const {id} = this.props.match.params;

		axios.get('http://localhost:8080/getGame/' + id).then(
			(res) => {
				console.log(res);
				const {moveListDe, startListDe} = res.data;
				const initialBoard = JSON.parse(startListDe);
				const moves = JSON.parse(moveListDe);
				console.log(initialBoard);
				console.log(moves);
				this.setState({
					loading: false,
					board: initialBoard,
					moves: moves,
				});
			},
			(err) => {
				alert(err);
				this.setState({
					loading: false,
					errors: err,
				});
			}
		);
	}
}

export default Replay;