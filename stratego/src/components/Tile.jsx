import React from 'react';
import '../stylesheets/Stratego.css';

import {matrix_includes} from "../LilacArray.js"

import {COLOR, IMPASSABLES, Color} from "./Stratego.jsx"
import {Piece} from "./Piece.jsx"

class Tile extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const selectTile = this.props.selectTile
    const row = this.props.row
    const col = this.props.col
    selectTile(row, col)
  }

  render() {
    const mode = this.props.mode
    const board = this.props.board
    const highlighted = this.props.highlighted
    const row = this.props.row
    const col = this.props.col

    let hasPiece = board[row][col]
    let color = hasPiece? board[row][col][COLOR]: null

    let isImpassable = matrix_includes(IMPASSABLES, [row, col])
    let isDanger = highlighted? matrix_includes(highlighted, [row, col]) && hasPiece: false
    let isHighlighted = highlighted? matrix_includes(highlighted, [row, col]): false
    

    let tile_class = "tile"
    if (isImpassable) {
      tile_class += " impassable"
    }  else if (isDanger) {
      tile_class += " danger"
    } else if (isHighlighted) {
      tile_class += " highlighted"
    } else if (color === Color.BLUE) {
      tile_class += " blue"
    } else if (color === Color.RED) {
      tile_class += " red"
    }

    let piece = "";
    if (hasPiece)
      piece = <Piece mode={mode}
                     board={board}
                     row={row}
                     col={col} />
  
    return (
      <div className={tile_class} onClick={this.handleClick} >
        {piece}
      </div>
    );
  }
}

export {Tile};