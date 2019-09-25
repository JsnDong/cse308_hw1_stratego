class Move {
	constructor(startPiece,startTile,targetPiece,targetTile) {
		this.startPiece = startPiece;
		this.startTile = startTile;
		this.targetPiece = targetPiece;
		this.targetTile = targetTile;
	}

	toString() {
		const [startRow, startCol] = this.startTile;
		const [endRow, endCol] = this.targetTile;
		const [startColor,startRank] = this.startPiece;
		// hide rank of AI 
		const rank = startColor == "RED" ? startRank : "Piece";

		const startMessage = rank + " (" + startColor[0] + ") at (" + startRow + "," + startCol + ") ";
		let actionMessage = " moved to (" + endRow + "," + endCol + ")";
		if (this.targetPiece !== null) {
			const [endColor,endRank] = this.targetPiece;
			actionMessage = "captured " + endRank + "(" + endColor[0] + ") at (" + endRow + "," + endCol + ")";
		}

		return startMessage + actionMessage;
	}
}

export {Move};