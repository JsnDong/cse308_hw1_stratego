import React from 'react';
import {matrix_includes, matrix} from "../LilacArray.js"
import {Board as BoardComponent} from "./Board.jsx"
import {handleMove, hasLost} from "../game/validation.js"
import {Move} from "../Move.js";
import MoveHistory from "./MoveHistory.jsx";
import { Scoreboard } from './Scoreboard.jsx';
import Stopwatch from './stopwatch.jsx';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

import Mode from "../Mode.js"
import Color from "../Color.js"
import Rank from "../Rank.js"
import Board from "../Board.js";
import Tile from '../Tile.js';

class Stratego extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            initialBoard: null,
            board: new Board(DIMENSION),
            scoreboard: this.setScoreboard(),
            moves: null,
            duration: null,
            username: props.username, 
        }
        this.selectTile = this.selectTile.bind(this)

        this.handleShuffle = this.handleShuffle.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleSurrender = this.handleSurrender.bind(this)
        this.handlePlayAgain = this.handlePlayAgain.bind(this)
        this.handleDraw = this.handleDraw.bind(this)
        this.handleWin = this.handleWin.bind(this)
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
            board: new Board(DIMENSION)
        })
    }

    handleStart() {
        const {board} = this.state.board;
        let deepTiles = matrix(DIMENSION);
        for (let row = 0; row < DIMENSION; row ++) {
            for (let col = 0; col < DIMENSION; col ++) {
                const tile = board[row][col];
                deepTiles[row][col] = new Tile(tile.row,tile.col);
                deepTiles[row][col].piece = tile.piece;
            }
        }
        console.log(deepTiles);
        this.state.board.setMode(Mode.PLAY);
        this.setState({
            initialBoard: deepTiles,
            moves: [],
            duration: 0,
        });
        this.startStopwatch();
    }

    isGameOver() {
        const board = this.state.board
        if (board.getMode() === Mode.SETUP || board.getMode() === Mode.PLAY || board.getMode() === Mode.TEST) {
            return false;
        } 
        this.stopStopwatch()
        let winLose;

        if (board.getMode() == Mode.LOST)
            winLose = 0
        else if (board.getMode() == Mode.WON)
            winLose = 1
        else if (board.getMode() == Mode.DRAW)
            winLose = 2


        const timer = this.state.duration
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
        console.log(display)

        const game = {
            username: this.state.username,
            winLose: winLose,
            time: display,
            moveList: this.state.moves,
            startList: this.state.initialBoard
        };

        axios.post('http://ec2-3-17-72-230.us-east-2.compute.amazonaws.com:8080/createGame', game).then(
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
        let board = this.state.board
        board.setMode(Mode.LOST)
        this.setState({
            board: board
        })
        this.isGameOver()
    }

    handleDraw() {
        this.state.board.setMode(Mode.DRAW);
        this.isGameOver();
    }

    handleWin() {
        this.state.board.setMode(Mode.WON);
        this.isGameOver();
    }

    handleLogOut() {
        localStorage.removeItem('token');
    }

    handlePlayAgain() {
        this.setState({
            board: new Board(DIMENSION),
            scoreboard: this.setScoreboard(),
            duration: 0
        })
    }

    selectTile(row, col) {
        let board = this.state.board
        let moves = this.state.moves
        const mode = board.getMode()
        const clicked_piece = board.getTile(row, col).getPiece()

        if (mode === Mode.SETUP && clicked_piece && clicked_piece.getColor() !== Color.BLUE) {
            if (!board.getSelected()) {
                board.setSelected(row, col)
            } else if (board.getSelected().isEqual(board.getTile(row, col))) {
                board.unselect()
            } else if (board.getSelected()) {
                board.getTile(row, col).setPiece(board.getSelected().getPiece())
                board.getSelected().setPiece(clicked_piece)
                board.unselect()
            }
                
            this.setState({
                board: board
            })
        } else if (mode === Mode.PLAY) {           
            if (!board.getSelected() && clicked_piece && clicked_piece.getColor() === board.getTurn()) {
                board.setSelected(row, col)
                this.setState({
                    board: board
                })
            } else if (board.getSelected() && board.getSelected().isEqual(board.getTile(row, col))) {
                board.unselect()
                this.setState({
                    board: board
                })
            } else if (board.getSelected() && board.getReachable().includes(board.getTile(row, col))) {
                /*
                if (board.getTurn() !== Color.BLUE)
                    this.stopStopwatch()
                */

                const selected_piece = board.getSelected().getPiece()
                console.log(selected_piece)
                const target_tile = board.getTile(row, col)
                const move = new Move(board.getSelected(), target_tile);

                const {winner, loser} = handleMove(selected_piece, target_tile)
                moves = [move, ...moves];

                if (winner && loser) {
                    this.updateScoreboard(loser.getColor(), loser.getRank())
                } else if (!winner && !loser) {
                    this.updateScoreboard(selected_piece.getColor(), selected_piece.getRank())
                    this.updateScoreboard(target_tile.getPiece().getColor(), target_tile.getPiece().getRank())
                }

                board.getSelected().setPiece(null)
                board.getTile(row, col).setPiece(winner)

                /*
                if (board.getTurn() === Color.BLUE)
                    this.startStopwatch()
                */

                board.nextTurn()
                //board.unselect();

                const scoreboard = this.state.scoreboard
                const player = board.getTurn()
                const opponent = player === Color.BLUE ? Color.RED : Color.BLUE

                console.log("won: ", board.hasLost(Color.BLUE, scoreboard))
                if (board.hasLost(player, scoreboard) && board.hasLost(opponent, scoreboard))
                    board.setMode(Mode.DRAW)
                else if (board.hasLost(Color.RED, scoreboard))
                    board.setMode(Mode.LOST)
                else if (board.hasLost(Color.BLUE, scoreboard))
                    board.setMode(Mode.WON)

                this.setState({
                    board: board,
                    moves: moves,
                })

                this.isGameOver()
            }
        }
    }

    render() {
        const board = this.state.board
        const mode = board.getMode()
        let shuffle_disabled = mode !== Mode.SETUP
        let start_disabled = mode !== Mode.SETUP
        let surrender_disabled = mode !== Mode.PLAY
        let playAgain_disabled = mode !== Mode.WON &&
                                 mode !== Mode.LOST &&
                                 mode !== Mode.DRAW

        return (
            <div className="stratego">
                <button onClick={this.handleShuffle} disabled={shuffle_disabled}>Shuffle</button>
                <button onClick={this.handleStart} disabled={start_disabled}>Start</button>
                <button onClick={this.handleWin} disabled={surrender_disabled}>Win</button>
                <button onClick={this.handleDraw} disabled={surrender_disabled}>Draw</button>
                <button onClick={this.handleSurrender} disabled={surrender_disabled}>Surrender</button>
                <button onClick={this.handlePlayAgain} disabled={playAgain_disabled}>Play Again</button>
                <Link to="/account" style={{ textDecoration: 'none' }}>
                    <button>Profile</button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button onClick= {this.handleLogOut}>Sign out</button>
                </Link>
                {<Stopwatch duration={this.state.duration} />}
                {mode}
                {<BoardComponent board={this.state.board} selectTile={this.selectTile} />}
                {<Scoreboard scoreboard={this.state.scoreboard} />}
                {<MoveHistory moves={this.state.moves} />}
            </div>
        );
    }
}

const DIMENSION = 10;

export default Stratego;