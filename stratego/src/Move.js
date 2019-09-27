import {Rank} from './components/Stratego.jsx';


class Move {
	constructor(startPiece,startTile,targetPiece,targetTile) {
		const [startRow, startCol] = startTile;
		const [endRow, endCol] = targetTile;
		const [startColor,startRank] = startPiece;
		const startPower = Rank.properties[startRank].power;

		this.startRow = startRow;
		this.startCol = startCol;
		this.endRow = endRow;
		this.endCol = endCol;
		this.startColor = startColor;
		this.startRank = startRank;
		this.startPower = startPower;
		this.targetPiece = targetPiece;
	}

	toString() {
		// obstruct rank for AI move
		const rank = this.startColor == "RED" ? this.startRank : "Piece";
		const startMessage = rank + " (" + this.startColor[0] + ") at (" + this.startRow + "," + this.startCol + ") ";

		if (this.targetPiece === null) {
			return startMessage + this.constructMoveMessage();
		}

		const [endColor, endRank] = this.targetPiece;
		const endPower = Rank.properties[endRank].power;
		if (this.startPower == endPower) {
			return this.constructBothCaptureMessage();
		}
		else {
			return startMessage + this.constructSingleCaptureMessage();
		}
	}

	constructMoveMessage() {
		return " moved to (" + this.endRow + "," + this.endCol + ")";
	}

	constructSingleCaptureMessage() {
		const [endColor, endRank] = this.targetPiece;
		const endPower = Rank.properties[endRank].power;
		if (this.startPower < endPower) {
			return "got captured at (" + this.endRow + "," + this.endCol + ")!";
		}
		else {
			return "captured " + endRank + "(" + endColor[0] + ") at (" + this.endRow + "," + this.endCol + ")";
		}
	}

	constructBothCaptureMessage() {
		const [endColor, endRank] = this.targetPiece;
		const endPower = Rank.properties[endRank].power;
		const startPiece = this.startRank + " (" + this.startColor[0] + ")";
		const endPiece = endRank + " (" + endColor[0] + ") ";
		return "Both " + startPiece + " and " + endPiece + "got captured at (" + this.endRow + "," + this.endCol + ")!";
	}
}

export {Move};