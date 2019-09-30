import Rank from './Rank.js';
import Tile from './Tile.js';

class Move {
	constructor(startTile, targetTile) {
		this.startTile = new Tile(startTile.getRow(), startTile.getCol());
		this.targetTile = new Tile(targetTile.getRow(), targetTile.getCol());
		this.startTile.setPiece(startTile.getPiece());
		this.targetTile.setPiece(targetTile.getPiece());
	}

	getStart() {
		return this.startTile;
	}

	getTarget() {
		return this.targetTile;
	}

	toString() {
		const startColor = this.getStart().getPiece().getColor();
		const startRank = this.getStart().getPiece().getRank();

		const rank = startColor == 'RED' || this.getStart().getPiece().isRevealed() ? startRank : 'Piece';
		const startMessage =
			rank + ' (' + startColor[0] + ') at (' + this.startTile.row + ',' + this.startTile.col + ') ';

		if (this.getTarget().getPiece() === null) {
			return startMessage + this.constructMoveMessage();
		}

		const endRank = this.getTarget().getPiece().getRank();
		const endPower = Rank.properties[endRank].power;
		if (this.startPower == endPower) {
			return this.constructBothCaptureMessage();
		} else {
			return startMessage + this.constructSingleCaptureMessage();
		}
	}

	constructMoveMessage() {
		return ' moved to (' + this.getTarget().getRow() + ',' + this.getTarget().getCol() + ')';
	}

	constructSingleCaptureMessage() {
		const startRank = this.getStart().getPiece().getRank();
		const startPower = Rank.properties[startRank].power;
		const endColor = this.getTarget().getPiece().getColor();
		const endRank = this.getTarget().getPiece().getRank();
		const endPower = Rank.properties[endRank].power;
		if (startPower < endPower) {
			return 'got captured at (' + this.getTarget().getRow() + ',' + this.getTarget().getCol() + ')!';
		} else {
			return (
				'captured ' +
				endRank +
				'(' +
				endColor[0] +
				') at (' +
				this.getTarget().getRow() +
				',' +
				this.getTarget().getCol() +
				')'
			);
		}
	}

	constructBothCaptureMessage() {
		const startColor = this.startPiece.color();
		const startRank = this.startPiece.getRank();
		const endColor = this.targetPiece.getColor();
		const endRank = this.targetPiece.getRank();

		const startPieceString = startRank + ' (' + startColor[0] + ')';
		const endPiece = endRank + ' (' + endColor[0] + ') ';
		return (
			'Both ' +
			startPieceString +
			' and ' +
			endPiece +
			'got captured at (' +
			this.targetTile.row +
			',' +
			this.targetTile.col +
			')!'
		);
	}

	isEqual(move) {
		return (
			this.getStart().getPiece() === move.getStart().getPiece() &&
			this.getStart().isEqual(move.getStart()) &&
			this.getTarget().isEqual(move.getTarget())
		);
	}
}

export default Move;
