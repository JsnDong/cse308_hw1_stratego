import React from 'react';
import '../stylesheets/piece.scss';

import { Mode, Color, Rank, COLOR, RANK } from './Stratego.jsx';

class Piece extends React.Component {
	render() {
		const { board, row, col } = this.props;

		let color = board[row][col][COLOR];
		let rank = board[row][col][RANK];
		let symbol = Rank.properties[rank].symbol;

		let piece_class = 'piece';

		if (color === Color.BLUE) {
			piece_class += ' hidden';
		}

		return <div className={piece_class}>{symbol}</div>;
	}
}

export { Piece };
