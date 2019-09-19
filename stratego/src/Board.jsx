import React from 'react';
import './Stratego.css';

import {matrix_includes} from "./LilacArray.js"

import {Tile} from "./Tile.jsx"

class Board extends React.Component {
  render() {
    const {mode,board} = this.props;

    let tiles = []
    for (let row = 0; row < board.length; row++) {
      let tiles_row = [];
      for (let col = 0; col < board.length; col++) {
        let impassable = matrix_includes(IMPASSABLES, [row, col]);
        tiles_row.push(<Tile mode={mode} board={board} row={row} col={col} impassable={impassable} key={[row,col]}/>);
      }
      tiles.push(<div className="board_row" key={row}>{tiles_row}</div>);
    }

    return (
        <div className="board">
            {tiles}
        </div>
    );
  }
}

/*-----------CONSTANTS-----------*/

const IMPASSABLES = [[4,2],[5,2],
                     [4,3],[5,3],
                     [4,6],[5,6],
                     [4,7],[5,7]];

export {Board};