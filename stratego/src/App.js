import React from 'react';
import Tile from './Tile.jsx';

import './App.css';

const DIMENSION = 10;
const IMPASSABLES = ["(2,4)","(2,5)", "(3,4)", "(3,5)",
                     "(6,4)","(6,5)", "(7,4)", "(7,5)"];

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null
    }
  }

  render() {
    const board = [];

    for (let i = 0; i < DIMENSION; i++) {
      let board_row = [];
      for (let j = 0; j < DIMENSION; j++) {
        let impassable = IMPASSABLES.includes("(" + i + "," + j + ")");
        board_row.push(<Tile x={i} y={j} impassable={impassable}/>);
      }
      board.push(<div className="board_row">{board_row}</div>);
    }

    return board;
  }
}

export default Board