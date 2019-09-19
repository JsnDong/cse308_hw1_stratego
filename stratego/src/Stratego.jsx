import React from 'react';

import {isEqual, matrix, matrix_includes} from "./LilacArray.js"

import {Board} from "./Board.jsx"
//import Scoreboard from "./Scoreboard.jsx"

class Stratego extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: Mode.SETUP,
            board: this.setup()
        }
        this.handleShuffle = this.handleShuffle.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleSurrender = this.handleSurrender.bind(this)
        this.handlePlayAgain = this.handlePlayAgain.bind(this)
    }

    setup() {
        let tiles = matrix(DIMENSION);

        // SETUP BLUE PIECES
        let flag_position = [BLUE_FLAG_ROW, Math.floor(Math.random() * DIMENSION)]
        tiles[flag_position[0]][flag_position[1]] = [[Color.BLUE, Rank.FLAG]]

        let bomb_positions = getBombPositions(flag_position);
        bomb_positions.forEach(bomb_position => {
            tiles[bomb_position[0]][bomb_position[1]] = [[Color.BLUE, Rank.BOMB]]
        });

        let pieces = getPieces(Color.BLUE);
        BLUE_ROWS.forEach(row => {
            for (let col = 0; col < DIMENSION; col++) {
                if (!tiles[row][col]) {
                    let piece = pieces.splice(Math.floor(Math.random() * pieces.length), 1)
                    tiles[row][col] = piece
                }
            }
        });

        //SETUP RED PIECES
        flag_position = [RED_FLAG_ROW, Math.floor(Math.random() * 10)]
        tiles[flag_position[0]][flag_position[1]] = [[Color.RED, Rank.FLAG]]

        bomb_positions = getBombPositions(flag_position);
        bomb_positions.forEach(bomb_position => {
            tiles[bomb_position[0]][bomb_position[1]] = [[Color.RED, Rank.BOMB]]
        });

        pieces = getPieces(Color.RED);
        RED_ROWS.forEach(row => {
            for (let col = 0; col < DIMENSION; col++) {
                if (!tiles[row][col]) {
                    let piece = pieces.splice(Math.floor(Math.random() * pieces.length), 1)
                    tiles[row][col] = piece
                }
            }
        });

        return tiles
    }

    handleShuffle() {
        this.setState({
            board: this.setup()
        });
    }

    handleStart() {
        this.setState({
            mode: Mode.PLAY
        });
    }

    handleSurrender() {
        this.setState({
            mode: Mode.FINISH
        });

        /* TO DO: RECORD A LOSS FOR PLAYER ON SERVER */
    }

    handlePlayAgain() {
        this.setState({
            mode: Mode.SETUP,
            board: this.setup()
        });
    }

    movePiece() {
        /* TO DO: DEPENDING ON MODE, SWAP PIECE POSITIONS DURING SETUP OR MOVE PIECE DURING PLAY*/
    }

    render() {
        let shuffle_disabled = (this.state.mode === Mode.SETUP)? false: true
        let start_disabled = (this.state.mode === Mode.SETUP)? false: true
        let surrender_disabled = (this.state.mode === Mode.PLAY)? false: true
        let playAgain_disabled = (this.state.mode === Mode.FINISH)? false: true

        return (
            <div className="stratego">
                <button onClick={this.handleShuffle} disabled={shuffle_disabled}>Shuffle</button>
                <button onClick={this.handleStart} disabled={start_disabled}>Start</button>
                <button onClick={this.handleSurrender} disabled={surrender_disabled}>Surrender</button>
                <button onClick={this.handlePlayAgain} disabled={playAgain_disabled}>Play Again</button>
                {<Board mode={this.state.mode} board={this.state.board} />}
            </div>
        );
    }
}

/*-----------CONSTANTS-----------*/

const DIMENSION = 10;
const BLUE_FLAG_ROW = 0;
const RED_FLAG_ROW = 9;
const BLUE_ROWS = [0,1,2,3];
const RED_ROWS = [6,7,8,9];

/*-------------ENUMS-------------*/

const Mode = {
    SETUP: "SETUP",
    PLAY: "PLAY",
    FINISH: "FINISH"
}

const Color = {
    BLUE: "BLUE",
    RED: "RED"
};

const Rank = {
    FLAG: "FLAG", SPY: "SPY", SCOUT: "SCOUT", MINER: "MINER",
    SERGEANT: "SERGEANT", LIEUTENANT: "LIEUTENANT", CAPTAIN: "CAPTAIN", MAJOR: "MAJOR",
    COLONEL: "COLONEL", GENERAL: "GENERAL", MARSHALL: "MARSHALL", BOMB: "BOMB",
    properties: {
        FLAG: {power: 0, symbol: "F", quantity: 1},
        SPY: {power: 1,symbol: "1", quantity: 1},
        SCOUT: {power: 2,symbol: "2", quantity: 8},
        MINER: {power: 3,symbol: "3", quantity: 5},
        SERGEANT: {power: 4,symbol: "4", quantity: 4},
        LIEUTENANT: {power: 5,symbol: "5", quantity: 4},
        CAPTAIN: {power: 6,symbol: "6", quantity: 4},
        MAJOR: {power: 7,symbol: "7", quantity: 3},
        COLONEL: {power: 8,symbol: "8", quantity: 2},
        GENERAL: {power: 9,symbol: "9", quantity: 1},
        MARSHALL: {power: 10,symbol: "10", quantity: 1},
        BOMB: {power: 11,symbol: "B", quantity: 6}
    }
};

/*-------------Methods-------------*/

// parameter flag_position  array representing position of flag
// return array of arrays representing position of bombs
// first 2-3 bombs surround flag and the rest are randomly placed    
function getBombPositions(flag_position) {
    let bomb_positions = [];
    if (flag_position[0] - 1 > -1)
        bomb_positions.push([flag_position[0] - 1, flag_position[1]]);
    if (flag_position[0] + 1 < DIMENSION)
        bomb_positions.push([flag_position[0] + 1, flag_position[1]]);
    if (flag_position[1] - 1 > -1)
        bomb_positions.push([flag_position[0], flag_position[1] - 1]);
    if (flag_position[1] + 1 < DIMENSION)
        bomb_positions.push([flag_position[0], flag_position[1] + 1]);
    while(bomb_positions.length < 6) {
        let bomb_position;
        do {
            let row;
            if (flag_position[0])
                row = Math.floor((Math.random() * (RED_ROWS[3] - RED_ROWS[0]) + 1) + RED_ROWS[0]);
            else
                row = Math.floor((Math.random() * (BLUE_ROWS[3] - BLUE_ROWS[0]) + 1) + BLUE_ROWS[0]);
            let col = Math.floor(Math.random() * 10);
            bomb_position = [row, col];
        } while(isEqual(flag_position, bomb_position) || matrix_includes(bomb_positions, bomb_position));
        bomb_positions.push(bomb_position);
    }
    return bomb_positions;
}

// param - color - color of pieces to be returned
// return - array of pieces represented as 2 element array [color, rank]
// excludes flag and bombs which are to be created seperately
function getPieces(color) {
    let pieces = [];
    Object.keys(Rank.properties).forEach(rank => {
        if (Rank[rank] !== Rank.FLAG && Rank[rank] !== Rank.BOMB)
            for (let i = 0; i < Rank.properties[rank].quantity; i++)
                pieces.push([color, rank]);
    });

    return pieces;
}

export {Stratego, Color, Rank};