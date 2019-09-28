import {Rank, IMPASSABLES}  from '../components/Stratego.jsx'
import { matrix_includes } from '../LilacArray.js';
const size = 10;

export const AImove = (board, AIcolor) => {

    console.log(AIcolor);
    let movable = [];
    //get all moveable pieces
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if (board[i][j] && (board[i][j][0] === AIcolor)){
                    let possibleMoves = getMoves(board, i, j, Rank.properties[board[i][j][1]].power, AIcolor);
                    if(possibleMoves.length > 0){
                        movable.push({
                            x: i,
                            y: j,
                            moves: possibleMoves 
                        });
                    }
            }
        }
    }
    console.log(movable);
    let randy = Math.floor(Math.random()*movable.length);
    console.log("randy is : " + randy + ", length is " + movable.length);
    let action = movable[randy];
    let moveTo = action.moves[Math.floor(Math.random()*(action.moves.length))];
    board[moveTo.x][moveTo.y] = board[action.x][action.y];
    board[action.x][action.y] = null;
    return board;
}

const getMoves = (board, i,j, power, color) => {
    let moves = [];
    let x = i;
    let y = j;
    if((Rank.properties[board[x][y][1]].power === 0) || (Rank.properties[board[x][y][1]].power === 11)){
        return moves;
    }
    if((y+1 < 10) && (!ifIncludes(x, y+1)) && ((board[x][y+1] === null) || ((Rank.properties[board[x][y+1][1]].power <= power) && (board[x][y+1][0] !== color)))) {
        moves.push( {x: x, y: y+1,});
    }
    if ((x+1 < 10) && (!ifIncludes(x+1, y)) && ((board[x+1][y] === null) || ((Rank.properties[board[x+1][y][1]].power <= power) && (board[x+1][y][0] !== color)))) {
        moves.push( { x: x+1, y: y,}); 
    }
    if ((x-1 > -1) && (!ifIncludes(x-1, y))  && ((board[x-1][y] === null) || ((Rank.properties[board[x-1][y][1]].power <= power) && (board[x-1][y][0] !== color)))) {
        moves.push( {x: x-1, y: y,}); 
    }
    if ((y-1 > -1) && (!ifIncludes(x, y-1))  && ((board[x][y-1] === null) || ((Rank.properties[board[x][y-1][1]].power <= power) && (board[x][y-1][0] !== color)))) {
        moves.push( {x: x, y: y-1,});
    }
    return moves;
}

const ifIncludes = (targetx, targety) => {
    for(let i = 0; i < IMPASSABLES.length; i++){
        if((targetx === IMPASSABLES[i][0]) && (targety === IMPASSABLES[i][1])){
            return true;
        }
    }
    return false;
}