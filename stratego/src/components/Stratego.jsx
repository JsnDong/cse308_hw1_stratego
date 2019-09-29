import React from 'react';
import {isEqual, matrix, matrix_includes} from "../LilacArray.js"
import {Board} from "./Board.jsx"
import {handleMove, hasLost} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { Scoreboard } from './Scoreboard.jsx';
import Stopwatch from './stopwatch.jsx';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

class Stratego extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: Mode.SETUP,
            initialBoard: null,
            board: this.setup(),
            scoreboard: this.setScoreboard(),
            moves: null,
            turn: null,
            selected: null,
            highlighted: null,
            duration: null,
            username: props.username
        }
        this.selectTile = this.selectTile.bind(this)

        this.handleShuffle = this.handleShuffle.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleSurrender = this.handleSurrender.bind(this)
        this.handlePlayAgain = this.handlePlayAgain.bind(this)
    }

    setup() {
        let tiles = matrix(DIMENSION);

        let blue_flag_col = Math.floor(Math.random() * DIMENSION)
        let blue_bomb_positions = getBombPositions(Color.BLUE, blue_flag_col)
        let blue_pieces = getPieces()

        let red_flag_col = Math.floor(Math.random() * DIMENSION)
        let red_bomb_positions = getBombPositions(Color.RED, red_flag_col)
        let red_pieces = getPieces()

        // Piece represnted as [Color, Rank, isVisible]
        for (let row = 0; row < DIMENSION; row++) {
            for (let col = 0; col < DIMENSION; col++) {
                if (BLUE_ROWS.includes(row)) {
                    tiles[row][col] = [Color.BLUE]
                    if (row === BLUE_FLAG_ROW && col === blue_flag_col)
                        tiles[row][col].push(Rank.FLAG)
                    else if (matrix_includes(blue_bomb_positions, [row, col]))
                        tiles[row][col].push(Rank.BOMB)
                    else
                        tiles[row][col].push(blue_pieces.splice(Math.floor(Math.random() * blue_pieces.length), 1).pop())
                    tiles[row][col].push(false)
                } else if (RED_ROWS.includes(row)) {
                    tiles[row][col] = [Color.RED]
                    if (row === RED_FLAG_ROW && col === red_flag_col)
                        tiles[row][col].push(Rank.FLAG)
                    else if (matrix_includes(red_bomb_positions, [row, col]))
                        tiles[row][col].push(Rank.BOMB)
                    else
                        tiles[row][col].push(red_pieces.splice(Math.floor(Math.random() * red_pieces.length), 1).pop())
                    tiles[row][col].push(false)
                } else {
                    tiles[row][col] = null
                }
            }
        }
        return tiles
    }

    setScoreboard() {
        const ranks = Object.keys(Rank.properties)
        const header = ["Pieces", "Blue", "Red"]

        let scoreboard = [header]

        let scoreboard_row
        ranks.forEach(rank => {
            scoreboard_row = []
            scoreboard_row.push(rank)
            scoreboard_row.push(Rank.properties[rank].quantity)
            scoreboard_row.push(Rank.properties[rank].quantity)
            scoreboard.push(scoreboard_row)
        })

        return scoreboard
    }

    updateScoreboard(color, rank) {
        const color_index = color === Color.BLUE ? 1 : 2
        const rank_index = Rank.properties[rank].power + 1

        let scoreboard = this.state.scoreboard
        scoreboard[rank_index][color_index] = scoreboard[rank_index][color_index] - 1

        this.setState({
            scoreboard: scoreboard
        })
    }

    startStopwatch() {
        const start_time = Date.now() - this.state.duration
        const tick = () => {
            this.setState({
                duration: Date.now() - start_time
            })
        }
        this.stopwatch = setInterval(tick);
    }

    stopStopwatch() {
        clearInterval(this.stopwatch)
    }

    handleShuffle() {
        this.setState({
            selected: null,
            highlighted: null,
            board: this.setup()
        });
    }

    handleStart() {

        let deepTiles = matrix(DIMENSION);

        for (let row = 0; row < DIMENSION; row ++) {
            for (let col = 0; col < DIMENSION; col ++) {
                deepTiles[row][col] = this.state.board[row][col]
            }
        }

        this.setState({
            mode: Mode.PLAY,
            initialBoard: deepTiles,
            moves: [],
            turn: Color.RED,
            duration: 0,
            selected: null,
            highlighted: null,
        });
        this.startStopwatch()
    }

    handleGameOver(result) {
        this.stopStopwatch()
        this.setState({
            mode: result,               //TODO: not setting
            selected: null,
            highlighted: null,
        });

        let winLose;

        if (result == Mode.LOST)
            winLose = 0
        else if (result == Mode.WON)
            winLose = 1
        else if (result == Mode.DRAW)
            winLose = 2


        const timer = this.props.duration
        const minutes = Math.floor(timer / 1000 / 60)
        const seconds = Math.floor(timer / 1000 % 60)

        let display
        if (minutes < 10 && seconds < 10) {
            display = "0" + minutes + ":0" + seconds
        } else if (minutes < 10) {
            display = "0" + minutes + ":" + seconds
        } else {
            display = + minutes + ":" + seconds
        }

        const game = {
            username: this.state.username,
            winLose: winLose,
            time: display,
            moveList: this.state.moves,
            startList: this.state.initialBoard
        };

        axios.post('http://localhost:8080/createGame', game).then(
            (res) => {
                alert('Received Successful response from server!');
                console.log(res);
            },
            (err) => {
                alert('Server rejected response with: ' + err);
            }
        );

    }

    handleSurrender() {
        this.handleGameOver(Mode.LOST)
    }

    handleLogOut() {
        localStorage.removeItem('token');
    }

    handlePlayAgain() {
        this.setState({
            mode: Mode.SETUP,
            selected: null,
            highlighted: null,
            board: this.setup(),
            scoreboard: this.setScoreboard(),
            duration: 0
        });
    }

    selectTile(row, col) {
        let new_board = this.state.board

        if (this.state.mode === Mode.SETUP) {
            if (!this.state.selected) {
                if (new_board[row][col] && new_board[row][col][COLOR] === Color.RED) {
                    this.setState({
                        selected: [row, col],
                    })
                }
            } else {    // if a piece is already selected
                if (row  === this.state.selected[ROW] && col === this.state.selected[COL]) { // and the user clicks on the selected piece again
                    this.setState({
                        selected: null
                    })
                } else if (RED_ROWS.includes(row)) {
                    let piece_row = this.state.selected[ROW]
                    let piece_col = this.state.selected[COL]
                    let piece = new_board[piece_row][piece_col]

                    new_board[piece_row][piece_col] = new_board[row][col]
                    new_board[row][col] = piece

                    this.setState({
                        board: new_board,
                        selected: null
                    })
                }
            }
        } else if (this.state.mode === Mode.PLAY) {
            if (!this.state.selected) {
                if (new_board[row][col] && new_board[row][col][COLOR] === this.state.turn) {
                    let new_highlighted = getHighlighted(new_board, this.state.turn, row, col);

                    this.setState({
                        selected: new_highlighted.length? [row, col]: null,
                        highlighted: new_highlighted.length? new_highlighted: null
                    })
                }
            } else if (this.state.selected) {
                if (row  === this.state.selected[ROW] && col === this.state.selected[COL]) {
                    this.setState({
                        selected: null,
                        highlighted: null
                    })
                }
                else if (matrix_includes(this.state.highlighted, [row, col])) {
                    this.stopStopwatch()

                    const player = this.state.turn
                    const opponent = player === Color.BLUE ? Color.RED: Color.BLUE
                    const piece_row = this.state.selected[ROW]
                    const piece_col = this.state.selected[COL]
                    let board = this.state.board

                    const piece = board[piece_row][piece_col]
                    const target_tile = board[row][col]
                    const move = new Move(piece, [piece_row, piece_col], target_tile, [row, col]);

                    const {winner, loser} = handleMove(piece, target_tile)
                    const moves = [move, ...this.state.moves];

                    board[piece_row][piece_col] = null
                    board[row][col] = winner
                    if (winner && loser) {
                        this.updateScoreboard(loser[COLOR], loser[RANK])
                    } else if (!winner && !loser) {
                        this.updateScoreboard(piece[COLOR], piece[RANK])
                        this.updateScoreboard(target_tile[COLOR], target_tile[RANK])
                    }

                    if (player === Color.RED)
                        this.startStopwatch()

                    this.setState({
                        board: new_board,
                        turn: this.state.turn === Color.RED ? Color.BLUE : Color.RED,
                        selected: null,
                        highlighted: null,
                        moves: moves,
                    })

                    const scoreboard = this.state.scoreboard
                    board = this.state.board

                    if (hasLost(player, scoreboard, board) && hasLost(opponent, scoreboard, board))
                        this.handleGameOver(Mode.DRAW)
                    else if (hasLost(player, scoreboard, board))
                        this.handleGameOver(Mode.LOST)
                    else if (hasLost(opponent, scoreboard, board))
                        this.handleGameOver(Mode.WON)
                }
            }
        }
    }

    render() {
        let shuffle_disabled = this.state.mode !== Mode.SETUP
        let start_disabled = this.state.mode !== Mode.SETUP
        let surrender_disabled = this.state.mode !== Mode.PLAY
        let playAgain_disabled = this.state.mode !== Mode.WON &&
                                 this.state.mode !== Mode.LOST &&
                                 this.state.mode !== Mode.DRAW

        return (
            <div className="stratego">
                <div className="header">
                    <Link to="/account" className="links">
                        Profile
                    </Link>
                    <h5 className="pipe">|</h5>
					<Link to="/login" className="links" onClick={this.handleLogOut}>
						Sign Out
					</Link>
                </div>
                <div className="row">
                <div className="column">
                    <h3 className="links">
                    {<Stopwatch duration={this.state.duration} />}
                    </h3>
                    
                    {<Scoreboard scoreboard={this.state.scoreboard} className="scoreboard" />}
                </div>
                <div className="boardCard">
                {<Board
                        mode= {this.state.mode}
                        board={this.state.board}
                        selected = {this.state.selected}
                        highlighted = {this.state.highlighted}
                        selectTile={this.selectTile}
                        />}
                </div>
                <div className="column">
                <div className="subColumn">
                <div className="header-btn">
                    <Link className="links" onClick={this.handleShuffle} disabled={shuffle_disabled}>
                        Shuffle
                    </Link>
                    <h5 className="pipe">|</h5>
                    <Link  className="links" onClick={this.handleStart} disabled={start_disabled}>
                        Start
                    </Link>
                    <h5 className="pipe">|</h5>
                    <Link  className="links" onClick={this.handleSurrender} disabled={surrender_disabled}>
                        Surrender
                    </Link>
                    <h5 className="pipe">|</h5>
                    <Link  className="links" onClick={this.handlePlayAgain} disabled={playAgain_disabled}>
                        Play Again
                    </Link>
                </div>
                <div className="feed">
                    {<MoveHistory moves={this.state.moves} />}
                </div> 
                    </div>
                </div>
                </div>
                
            </div>
        );
    }
}

/*-----------CONSTANTS-----------*/

const DIMENSION = 10;
const BLUE_FLAG_ROW = 0
const COLOR = 0;
const ROW = 0;
const RED_FLAG_ROW = 9;
const RANK = 1;
const COL = 1;
const ISVISABLE = 2;
const BLUE_ROWS = [0,1,2,3];
const RED_ROWS = [6,7,8,9];
const IMPASSABLES = [[4,2],[5,2],
                     [4,3],[5,3],
                     [4,6],[5,6],
                     [4,7],[5,7]];

/*-------------ENUMS-------------*/

const Mode = {
    SETUP: "SETUP",
    PLAY: "PLAY",
    WON: "WON",
    LOST: "LOST",
    DRAW: "DRAW",
    TEST: "TEST"
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
function getBombPositions(color, flag_col) {
    let bomb_positions = [];

    let flag_row = (color === Color.BLUE) ? BLUE_FLAG_ROW : RED_FLAG_ROW

    if (flag_row - 1 > -1)
        bomb_positions.push([flag_row - 1, flag_col]);
    if (flag_row + 1 < DIMENSION)
        bomb_positions.push([flag_row + 1, flag_col]);
    if (flag_col - 1 > -1)
        bomb_positions.push([flag_row, flag_col - 1]);
    if (flag_col + 1 < DIMENSION)
        bomb_positions.push([flag_row, flag_col + 1]);

    let row, col, bomb_position;
    while(bomb_positions.length < 6) {
        do {
            row = (color === Color.BLUE) ? (Math.floor((Math.random() * (BLUE_ROWS[BLUE_ROWS.length - 1] - BLUE_ROWS[0]) + 1) + BLUE_ROWS[0])):
                                           (Math.floor((Math.random() * (RED_ROWS[RED_ROWS.length - 1] - RED_ROWS[0]) + 1) + RED_ROWS[0]))
            col = Math.floor(Math.random() * 10);
            bomb_position = [row, col]
        } while( isEqual([flag_row, flag_col], bomb_position) || matrix_includes(bomb_positions, bomb_position));
        bomb_positions.push(bomb_position);
    }
    return bomb_positions;
}

// param - color - color of pieces to be returned
// return - array of pieces represented as 2 element array [color, rank]
// excludes flag and bombs which are to be created seperately
function getPieces() {
    let pieces = [];
    Object.keys(Rank.properties).forEach(rank => {
        if (Rank[rank] !== Rank.FLAG && Rank[rank] !== Rank.BOMB)
            for (let i = 0; i < Rank.properties[rank].quantity; i++)
                pieces.push(rank);
    });

    return pieces;
}

function getHighlighted(board, turn, row, col) {
    const rank = board[row][col][RANK]

    let highlighted = []
    if (rank !== Rank.FLAG && rank !== Rank.BOMB) {
        if (rank === Rank.SCOUT) {
            for (let highlighted_row = row - 1, i = true; highlighted_row > -1 && i; highlighted_row--) {
                if ((board[highlighted_row][col] && board[highlighted_row][col][COLOR] === turn) || matrix_includes(IMPASSABLES, [highlighted_row, col]))
                    i = false
                else if (board[highlighted_row][col] && board[highlighted_row][col][COLOR] !== turn) {
                    highlighted.push([highlighted_row, col])
                    i = false
                }
                else if (!board[highlighted_row][col]  && !matrix_includes(IMPASSABLES, [highlighted_row, col]))
                    highlighted.push([highlighted_row, col])
            }
            for (let highlighted_row = row + 1, i = true; highlighted_row < DIMENSION && i; highlighted_row++) {
                if ((board[highlighted_row][col] && board[highlighted_row][col][COLOR] === turn) || matrix_includes(IMPASSABLES, [highlighted_row, col]))
                    i = false
                else if (board[highlighted_row][col] && board[highlighted_row][col][COLOR] !== turn) {
                    highlighted.push([highlighted_row, col])
                    i = false
                }
                else if (!board[highlighted_row][col]  && !matrix_includes(IMPASSABLES, [highlighted_row, col]))
                    highlighted.push([highlighted_row, col])
            }

            for (let highlighted_col = col - 1, i = true; highlighted_col > -1 && i; highlighted_col--) {
                if ((board[row][highlighted_col] && board[row][highlighted_col][COLOR] === turn) || matrix_includes(IMPASSABLES, [row, highlighted_col]))
                    i = false
                else if (board[row][highlighted_col] && board[row][highlighted_col][COLOR] !== turn) {
                    highlighted.push([row, highlighted_col])
                    i = false
                }
                else if (!board[row][highlighted_col]  && !matrix_includes(IMPASSABLES, [row, highlighted_col]))
                    highlighted.push([row, highlighted_col])
            }
            for (let highlighted_col = col + 1, i = true; highlighted_col < DIMENSION && i; highlighted_col++) {
                if ((board[row][highlighted_col] && board[row][highlighted_col][COLOR] === turn) || matrix_includes(IMPASSABLES, [row, highlighted_col]))
                    i = false
                else if (board[row][highlighted_col] && board[row][highlighted_col][COLOR] !== turn) {
                    highlighted.push([row, highlighted_col])
                    i = false
                }
                else if (!board[row][highlighted_col]  && !matrix_includes(IMPASSABLES, [row, highlighted_col]))
                    highlighted.push([row, highlighted_col])
            }
        } else {
            if (row - 1 > -1 && (!board[row - 1][col] || board[row - 1][col][COLOR] !== turn) && !matrix_includes(IMPASSABLES, [row - 1, col]))
                highlighted.push([row - 1, col])
            if (row + 1 < DIMENSION && (!board[row + 1][col] || board[row + 1][col][COLOR] !== turn) && !matrix_includes(IMPASSABLES, [row + 1, col]))
                highlighted.push([row + 1, col])
            if (col - 1 > -1 && (!board[row][col - 1] || board[row][col - 1][COLOR] !== turn) && !matrix_includes(IMPASSABLES, [row, col - 1]))
                highlighted.push([row, col - 1])
            if (col + 1 < DIMENSION && (!board[row][col + 1] || board[row][col + 1][COLOR] !== turn) && !matrix_includes(IMPASSABLES, [row, col + 1]))
                highlighted.push([row, col + 1])
        }
    }

    return highlighted
}

export {DIMENSION, IMPASSABLES, COLOR, RANK, ISVISABLE, ROW, COL, Mode, Color, Rank, getHighlighted};
export default Stratego;