import React from 'react';
import "../stylesheets/Stratego.css"

import Rank from "../Rank.js"

class Piece extends React.Component {
    render() {
        const {piece} = this.props
        const rank = piece.getRank()

        return (
            <div className={"piece"}>
                {Rank.properties[rank].symbol}
            </div>
        );
    }
}

export {Piece};
