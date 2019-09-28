import React from 'react';
import '../stylesheets/App.css';

class Scoreboard extends React.Component {
    render() {
        const {scoreboard} = this.props
        let table = []
        let table_row;
        for (let row = 0; row < scoreboard.length; row++) {
            table_row = []
            for (let col = 0; col < scoreboard[0].length; col++) {
                if (!row) {
                    table_row.push(<th key={scoreboard[row][col]}>{scoreboard[row][col]}</th>)
                } else {
                    table_row.push(<td key={scoreboard[0][col] + " " + scoreboard[row][0]}>{scoreboard[row][col]}</td>)
                }
            }
            table.push(<tr key={scoreboard[row][0]}>{table_row}</tr>)
        }

        return (
            <table className="scoreboard">
                <tbody>
                    {table}
                </tbody>
            </table>
        );
    }
}

export {Scoreboard};