import React from 'react';
import '../stylesheets/piece.scss';
import bomb from '../stylesheets/unlit-bomb.svg'
import flag from '../stylesheets/flying-flag.svg'
import { RANK, Rank } from './Stratego.jsx';

class Piece extends React.Component {
	render() {
		const { board, row, col } = this.props;

		const rank = board[row][col][RANK];
		const symbol = Rank.properties[rank].symbol;
		if(symbol === "B"){
			return (<div className={'piece'}>
				<img style={{width: 20}}src={bomb} />
				</div>);
		}
		else if(symbol === "F") {
			return (<div className={'piece'}>
				<img style={{width: 20}}src={flag} />
				</div>);
		}
		else {
			return <div className={'piece'}>{symbol}</div>;
		}
	}
}

export { Piece };
