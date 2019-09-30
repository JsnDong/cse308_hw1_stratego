import React from 'react';
import '../stylesheets/Stratego.css';
import Color from "../Color.js"

import {Piece} from "./Piece.jsx"

class Tile extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const tile = this.props.tile
    const selectTile = this.props.selectTile 
    selectTile(tile.getRow(), tile.getCol())
  }

  render() {
    const board = this.props.board
    const tile = this.props.tile

    const piece = tile.getPiece()
    const color = piece ? piece.getColor() : null

    let reachable = board.getReachable() && board.getReachable().includes(tile)
    let danger = reachable && piece && color !== board.getTurn()
    let selected = board.getSelected() && board.getSelected().isEqual(tile)
    

    let tile_class = "tile"
    if (tile.isImpassable()) {
      tile_class += " impassable"
    }  else if (danger) {
      tile_class += " danger"
    } else if (selected && color === Color.BLUE) {
      tile_class += " blue_selected"
    } else if (selected && color === Color.RED) {
      tile_class += " red_selected"
    } else if (reachable) {
      tile_class += " highlighted"
    } else if (color === Color.BLUE) {
      tile_class += " blue"
    } else if (color === Color.RED) {
      tile_class += " red"
    }

    let piece_display = "";
    if (piece && (color === Color.RED || (color === Color.BLUE && piece.isRevealed())))
      piece_display = <Piece piece={piece} />
  
    return (
      <div className={tile_class} onClick={this.handleClick} >
        {piece_display}
      </div>
    );
  }
}

export {Tile};