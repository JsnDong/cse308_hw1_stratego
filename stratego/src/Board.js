import {matrix} from "./LilacArray.js"
import Mode from "./Mode.js"
import Color from "./Color.js"
import Rank from  "./Rank.js"
import Tile from "./Tile.js"
import Piece from "./Piece.js"

class Board {
    constructor(dimension) {
        this.dimension = dimension
        this.board = matrix(dimension)

        for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
                this.setTile(row, col)
            }
        }

        this.arrangePieces(Color.BLUE)
        this.arrangePieces(Color.RED)

        this.mode = Mode.SETUP
        this.turn = Color.RED
        this.selected = null
        this.reachable = null
    }

    getDimension() {
        return this.dimension
    }

    getBoard() {
        return this.board
    }

    getTile(row, col) {
        return this.board[row][col]
    }

    setTile(row, col) {
        this.board[row][col] = new Tile(row, col)
    }

    getMode() {
        return this.mode
    }

    setMode(mode) {
        this.mode = mode
    }

    getTurn() {
        return this.turn
    }

    nextTurn() {
        this.unselect()
        this.turn = this.turn === Color.BLUE ? Color.RED : Color.BLUE
    }

    getSelected() {
        return this.selected
    }

    setSelected(row, col) {
        this.selected = this.getTile(row, col)
        if (this.getMode() === Mode.PLAY)
            this.reachable = this.calculateReachable(row, col)
    }
    
    unselect() {
        this.selected = null
        this.reachable = null
    }

    getReachable() {
        return this.reachable
    }

    calculateReachable(row, col) {
        let reachable = []
        const rank = this.getTile(row, col).getPiece().getRank()
        let tile
        for (let top = true, right = true, bottom = true, left = true, scout = true, step = 1;
            (top || right || bottom || left) && scout && rank !== Rank.FLAG && rank !== Rank.BOMB;
            step++) {

            tile = row - step > -1 && top ? this.getTile(row - step, col) : null
            if (tile && (tile.isOccupiable() || (tile.getPiece() && tile.getPiece().getColor() !== this.getTurn())))
                reachable.push(tile)
            top = tile && tile.isOccupiable()

            tile = col + step < this.getDimension() && right ? this.getTile(row, col + step) : null
            if (tile && (tile.isOccupiable() || (tile.getPiece() && tile.getPiece().getColor() !== this.getTurn())))
                reachable.push(tile)
            right = tile && tile.isOccupiable()

            tile = row + step < this.getDimension() && bottom ? this.getTile(row + step, col) : null
            if (tile && (tile.isOccupiable() || (tile.getPiece() && tile.getPiece().getColor() !== this.getTurn())))
                reachable.push(tile)
            bottom = tile && tile.isOccupiable()

            tile = col - step > - 1 && left ? this.getTile(row, col - step) : null
            if (tile && (tile.isOccupiable() || (tile.getPiece() && tile.getPiece().getColor() !== this.getTurn())))
                reachable.push(tile)
            left = tile && tile.isOccupiable()

            scout = rank === Rank.SCOUT 
        }
        return reachable
    }

    arrangePieces(color) {
        const starting_row = color === Color.BLUE ? 0 : 6
        const flag_row = color === Color.BLUE ? 0 : 9
        const flag_col = Math.floor(Math.random() * this.getDimension())
        this.getTile(flag_row, flag_col).setPiece(new Piece(color, Rank.FLAG))

        const frontal_bomb_row = color === Color.BLUE ? flag_row + 1 : flag_row - 1
        this.getTile(frontal_bomb_row, flag_col).setPiece(new Piece(color, Rank.BOMB))

        let bombs = 1
        if (flag_col - 1 > -1)
            this.getTile(flag_row, flag_col - 1).setPiece(new Piece(color, Rank.BOMB))
            bombs++
        if (flag_col + 1 < this.getDimension())
            this.getTile(flag_row, flag_col + 1).setPiece(new Piece(color, Rank.BOMB))
            bombs++

        let bomb_row, bomb_col
        while (bombs++ < 7) {
            do {
                bomb_row =  Math.floor(Math.random() * 4 + starting_row)
                bomb_col =  Math.floor(Math.random() * 10);
            } while (this.getTile(bomb_row, bomb_col).getPiece())
            this.getTile(bomb_row, bomb_col).setPiece(new Piece(color, Rank.BOMB))
        }

        let pieces = Piece.getStartingPieces(color)
        let random_piece
        for (let row = starting_row; row < starting_row + 4; row++) {
            for (let col = 0; col < this.getDimension(); col++) {
                if (!this.getTile(row, col).getPiece()) {
                    random_piece = pieces.splice(Math.floor(Math.random() * pieces.length), 1).pop()
                    this.getTile(row, col).setPiece(random_piece)
                }
            }
        }
    }

    hasLost(color, scoreboard) {
        const color_index = color === Color.BLUE ? 1 : 2

        const hasFlag = scoreboard[Rank.properties[Rank.FLAG].power + 1][color_index]
        if (!hasFlag) {
            return true
        }

        let piece
        for (let row = 0; row < this.getDimension(); row++) {
            for (let col = 0; col < this.getDimension(); col++) {
                piece = this.getTile(row, col).getPiece()
                if (piece && piece.getColor() === color && this.calculateReachable(row, col).length > 0) {
                    console.log(row, col, this.calculateReachable(row, col))
                    return false
                }
            }
        }

        return true
    }

    copy() {
        const copy = new Board(DIMENSION)
        let deepTiles = matrix(DIMENSION);
        for (let row = 0; row < DIMENSION; row ++) {
            for (let col = 0; col < DIMENSION; col ++) {
                const tile = this.board[row][col];
                deepTiles[row][col] = new Tile(tile.row,tile.col);
                deepTiles[row][col].piece = tile.piece;
            }
        }
        copy.board = deepTiles;
        return copy;
    }
}

const DIMENSION = 10;

export default Board