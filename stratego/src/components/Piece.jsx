import React from 'react';
import "../stylesheets/Stratego.css"

import {Color,Rank} from "./Stratego.jsx"

class Piece extends React.Component {
    render() {
        const {color, rank} = this.props;
        let owner = (color === Color.RED) ? "red" : "blue";

        let text = Rank.properties[rank].symbol
        let text_div = "";
        if (owner === "blue") {
            text_div = <div className="hidden">{text}</div>
        } else {
            text_div = <div>{text}</div>
        }

        return (
            <div className={"piece " + owner}>
                {text_div}
            </div>
        );
    }
}

export {Piece};
