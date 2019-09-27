import {DIMENSION, COLOR, RANK, ISVISABLE, Rank, getHighlighted}  from '../components/Stratego.jsx'

/**
 * Check if enemy's flag is gone or if enemy has no moving pieces left
 * @param {*} board 
 * @param {*} endx 
 * @param {*} endy 
 */

function hasLost(color, scoreboard, board) {
    const color_index = color === Color.BLUE ? 1 : 2

    const hasFlag = scoreboard[Rank.properties[Rank.FLAG].power + 1][color_index]
    if (!hasFlag)
        return true

    let piece, piece_moves
    for (let row = 0; row < DIMENSION; row++) {
        for (let col = 0; col < DIMENSION; col++) {
            piece = board[row][col]
            piece_moves = getHighlighted(board, color, row, col).length
            if (piece && piece[COLOR] === color && piece_moves.length)
                return false
        }
    }

    return true
};

/**
 * Returns updated board. Checks which piece should win and kills other
 * 
 * @param {2d array} board - the board where a swap will happen
 * @param {number} actionx - the piece moving
 * @param {number} actiony - the piece moving
 * @param {number} targetx - the target tile spot
 * @param {number} targety - the target tile spot
 */
export const handleMove = (piece, target_tile) => {
    let result = {}
    if (!target_tile) {
        result.winner = piece
        result.loser = target_tile
        return result
    }
        
    const piece_power = Rank.properties[piece[RANK]].power;
    const target_power = Rank.properties[target_tile[RANK]].power;

    if (piece_power === target_power) {
        result.winner = null
        result.loser = null
        return result
    } else if ((piece_power > target_power) ||
        (piece_power === 3 && target_power === 11) ||
        (piece_power === 1 && target_power === 10)) {
            result.winner = piece
            result.loser = target_tile
    } else {
        result.winner = target_tile
        result.loser = piece
    }
        
    result.winner[ISVISABLE] = true

    return result
};

export {hasLost}