import {matrix_includes} from "./LilacArray.js"

class Tile {
    constructor(row, col) {
        this.row = row
        this.col = col
        this.piece = null
    }

    getRow() {
        return this.row
    }

    getCol() {
        return this.col
    }

    isImpassable() {
        return matrix_includes(IMPASSABLE_TILES, [this.row, this.col])
    }

    getPiece() {
        return this.piece
    }

    setPiece(piece) {
        this.piece = piece
    }

    isOccupiable() {
        return !this.isImpassable() && !this.getPiece() 
    }

    isEqual(tile) {
        return this.row === tile.row && this.col === tile.col
    }
}

const IMPASSABLE_TILES = [[4, 2], [4, 3], [4, 6], [4, 7],
                          [5, 2], [5, 3], [5, 6], [5, 7]]

export default Tile