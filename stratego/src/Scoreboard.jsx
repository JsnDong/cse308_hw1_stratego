import React from 'react';
import './App.css';

class Scoreboard extends React.Component {
    render() {
        let scoreboard = [];
        let ranks = Object.keys(this.state.pieces);
        for (let i = 0; i < ranks.length; i++) {
            scoreboard.push(<div className="scoreboard_row">
                                {ranks[i] + "\t" + this.state.pieces[ranks[i]].BLUE + "\t" + this.state.pieces[ranks[i]].RED}
                             </div>);
        }

        return (
            <div className="scoreboard">
                <div className="scoreboard_header">
                        {"BLUE \t RED"}
                </div>
                {scoreboard}
            </div>
        );
    }
}

export {Scoreboard};