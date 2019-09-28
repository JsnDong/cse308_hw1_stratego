import React from 'react';
import '../stylesheets/tile.scss';

import { matrix_includes } from '../LilacArray.js';

import { COLOR, ROW, COL, IMPASSABLES, Color } from './Stratego.jsx';
import { Piece } from './Piece.jsx';

class Tile extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const selectTile = this.props.selectTile;
		const row = this.props.row;
		const col = this.props.col;
		selectTile(row, col);
	}

	render() {
		const mode = this.props.mode;
		const board = this.props.board;
		const selected = this.props.selected;
		const highlighted = this.props.highlighted;
		const row = this.props.row;
		const col = this.props.col;

		let hasPiece = board[row][col];
		let color = hasPiece ? board[row][col][COLOR] : null;
		let isVisable = hasPiece ? board[row][col][2] : null;

		let isImpassable = matrix_includes(IMPASSABLES, [ row, col ]);
		let isDanger = highlighted ? matrix_includes(highlighted, [ row, col ]) && hasPiece : false;
		let isSelected = selected && row === selected[ROW] && col === selected[COL];
		let isHighlighted = highlighted ? matrix_includes(highlighted, [ row, col ]) : false;

		let tile_class = 'tile';
		if (isImpassable) {
			tile_class += ' impassable';
		} else if (isDanger) {
			tile_class += ' danger';
		} else if (isSelected && color === Color.BLUE) {
			tile_class += ' blue_selected';
		} else if (isSelected && color === Color.RED) {
			tile_class += ' red_selected';
		} else if (isHighlighted) {
			tile_class += ' highlighted';
		} else if (color === Color.BLUE) {
			tile_class += ' blue';
		} else if (color === Color.RED) {
			tile_class += ' red';
		}

		let piece = '';
		if (hasPiece && (color === Color.RED || (color === Color.BLUE && isVisable)))
			piece = <Piece mode={mode} board={board} row={row} col={col} />;

		return (
			<div className={tile_class} onClick={this.handleClick}>
				{piece}
			</div>
		);
	}
}

export { Tile };
