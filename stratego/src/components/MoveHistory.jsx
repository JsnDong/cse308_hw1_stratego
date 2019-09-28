import React from 'react';
import "../stylesheets/Stratego.css"

class MoveHistory extends React.Component {

    render() {
        const {moves} = this.props
        const moveList = moves ? moves.map((move) => 
            <li> {move.toString()}</li>
        ): [];

        return (
            <div>
                <ul>
                    {moveList}
                </ul>
            </div>
        );
    }
}

export default MoveHistory;
