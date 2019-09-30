import React from 'react';
import '../stylesheets/piece.scss';
import bomb from '../stylesheets/unlit-bomb.svg'
import flag from '../stylesheets/flying-flag.svg'
import Rank from "../Rank.js"

class Piece extends React.Component {
    render() {
        const {piece} = this.props
        const rank = piece.getRank()

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
