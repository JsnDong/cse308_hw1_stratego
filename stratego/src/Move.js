import Rank from './Rank.js';


class Move {
	constructor(startTile, targetTile) {

		this.startTile = startTile;
		this.targetTile = targetTile;
		this.startPiece = startTile.piece;
		this.targetPiece = targetTile.piece;
	}

	toString() {
		// obstruct rank for AI move
		const startColor = this.startPiece.getColor();
		const startRank = this.startPiece.getRank();
		const startPower = Rank.properties[startRank].power;

		const rank = startColor == "RED" || this.startPiece.revealed ? startRank : "Piece";
		const startMessage = rank + " (" + startColor[0] + ") at (" + this.startTile.row + "," + this.startTile.col + ") ";

		if (this.targetPiece === null) {
			return startMessage + this.constructMoveMessage();
		}

		const endColor = this.targetPiece.getColor(); 
		const endRank = this.targetPiece.getRank();
		const endPower = Rank.properties[endRank].power;
		if (this.startPower == endPower) {
			return this.constructBothCaptureMessage();
		}
		else {
			return startMessage + this.constructSingleCaptureMessage();
		}
	}

	constructMoveMessage() {
		return " moved to (" + this.targetTile.row + "," + this.targetTile.col + ")";
	}

	constructSingleCaptureMessage() {
		const endColor = this.targetPiece.getColor(); 
		const endRank = this.targetPiece.getRank();
		const endPower = Rank.properties[endRank].power;
		if (this.startPower < endPower) {
			return "got captured at (" + this.targetTile.row + "," + this.targetTile.col + ")!";
		}
		else {
			return "captured " + endRank + "(" + endColor[0] + ") at (" + this.targetTile.row + "," + this.targetTile.col + ")";
		}
	}

	constructBothCaptureMessage() {
		const startColor = this.startPiece.color();
		const startRank = this.startPiece.getRank();
		const endColor = this.targetPiece.getColor(); 
		const endRank = this.targetPiece.getRank();
		const startPower = Rank.properties[startRank].power;
		const endPower = Rank.properties[endRank].power;

		const startPieceString = startRank + " (" + startColor[0] + ")";
		const endPiece = endRank + " (" + endColor[0] + ") ";
		return "Both " + startPieceString + " and " + endPiece + "got captured at (" + this.targetTile.row + "," + this.targetTile.col + ")!";
	}
}

export {Move};