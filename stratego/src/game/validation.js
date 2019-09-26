import {Rank}  from '../components/Stratego.jsx'


/**
 * Returns updated board. Checks which piece should win and kills other
 * 
 * @param {2d array} board - the board where a swap will happen
 * @param {number} actionx - the piece moving
 * @param {number} actiony - the piece moving
 * @param {number} targetx - the target tile spot
 * @param {number} targety - the target tile spot
 */
export const handleMove = (board, actionx, actiony, targetx, targety) => {
    if(board[targetx][targety] === null){
        board[targetx][targety] = board[actionx][actiony];
        board[actionx][actiony] = null;
        return board;
    }
    const power = Rank.properties[board[actionx][actiony][1]].power;
    const tpower = Rank.properties[board[targetx][targety][1]].power;
    console.log(power)
    console.log(tpower)
    if(((power === 3) && (tpower === 11)) || ((power === 1) && (tpower === 10)) || (tpower < power)){
        board[targetx][targety]= board[actionx][actiony]; //miner has disarmed a bomb and swapped places
        board[actionx][actiony] = null;
    } else if(power === tpower){
        board[actionx][actiony] = null;
        board[targetx][targety] = null;
    } else {
        board[targetx][targety][2] = true;
        board[actionx][actiony] =  null; //selfdestruct
    }
    return board;
}; 