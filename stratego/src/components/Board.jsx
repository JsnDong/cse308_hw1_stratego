import React from 'react';
import { Tile } from './Tile.jsx';

import '../stylesheets/board.scss';

class Board extends React.Component {

	render() {
		const {board, selectTile} = this.props;

		let board_class = 'board';

		let tiles = [];
		let tiles_row;

		for (let row = 0; row < board.getDimension(); row++) {
		  tiles_row = [];
		  for (let col = 0; col < board.getDimension(); col++) {
		    tiles_row.push(<Tile board={board} tile={board.getTile(row, col)} selectTile={selectTile} key={[row,col]} />);
		  }
		  tiles.push(<div className="board_row" key={row}>{tiles_row}</div>);
		}
		return <div disabled={this.props.disabled} className={board_class}>{tiles}</div>;
	}
}

export { Board };
