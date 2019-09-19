import React from 'react';
import '../stylesheets/Stratego.css';

import {Piece} from "./Piece.jsx"

class Tile extends React.Component {
  render() {
    const {mode, board, row, col, impassable} = this.props;

    let terrain = impassable?  "impassable" : "passable";
    let hasPiece = board[row][col]
    let piece = "";
    if (hasPiece)
      piece = <Piece mode={mode} color={board[row][col][0][0]} rank={board[row][col][0][1]} />
  
    return (
      <div className={"tile " + terrain}>
        {piece}
      </div>
    );
  }
}

export {Tile};