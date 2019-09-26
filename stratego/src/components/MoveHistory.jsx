import React from 'react';
import "../stylesheets/Stratego.css"

class MoveHistory extends React.Component {

    render() {
        const moveList = this.props.moves.map((move) => 
            <li> {move.toString()}</li>
        );

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
