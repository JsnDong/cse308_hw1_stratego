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
		const selected_piece = this.startPiece;
		
		const color = selected_piece.getColor();
		const rank = color == "RED" ? selected_piece.getRank() : "Piece";	// hide rank of AI

		const startMessage = rank + " (" + color[0] + ") at (" + startRow + "," + startCol + ") ";
		let actionMessage = " moved to (" + endRow + "," + endCol + ")";
		if (this.targetPiece.getPiece()) {
			console.log(this.targetPiece.getPiece().getColor())
			const target_color = this.targetPiece.getPiece().getColor()
			const target_rank = this.targetPiece.getPiece().getRank()
			actionMessage = "captured " + target_rank + "(" + target_color[0] + ") at (" + endRow + "," + endCol + ")";
		}

		return startMessage + actionMessage;
	}
}

export {Move};