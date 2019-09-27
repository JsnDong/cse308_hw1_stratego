import React from 'react';

import { Tile } from './Tile.jsx';

class Board extends React.Component {
	render() {
		const { mode, board, selected, highlighted, selectTile } = this.props;

		let board_class = 'board';

		let tiles = [];
		let tiles_row;

		for (let row = 0; row < board.length; row++) {
			tiles_row = [];
			for (let col = 0; col < board.length; col++) {
				tiles_row.push(
					<Tile
						mode={mode}
						board={board}
						selected={selected}
						highlighted={highlighted}
						selectTile={selectTile}
						row={row}
						col={col}
						key={[ row, col ]}
					/>
				);
			}
			tiles.push(
				<div className="board_row" key={row}>
					{tiles_row}
				</div>
			);
		}

		return <div className={board_class}>{tiles}</div>;
	}
}

export { Board };
