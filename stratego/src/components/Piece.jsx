import React from 'react';
import "../stylesheets/Stratego.css"

import {RANK, Rank} from "./Stratego.jsx"

class Piece extends React.Component {
    render() {
        const {board, row, col} = this.props

        const rank = board[row][col][RANK]
        const  symbol = Rank.properties[rank].symbol

        return (
            <div className={"piece"}>
                {symbol}
            </div>
        );
    }
}

export {Piece};
