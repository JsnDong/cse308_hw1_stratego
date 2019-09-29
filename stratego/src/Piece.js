import Rank from "./Rank.js"

class Piece {
    constructor(color, rank) {
        this.color = color
        this.rank = rank
        this.revealed = false
    }

    getColor() {
        return this.color
    }

    getRank() {
        return this.rank
    }

    isRevealed() {
        return this.revealed
    }

    reveal() {
        this.revealed = true
    }

    static getStartingPieces(color) {
        let pieces = [];
        Object.keys(Rank.properties).forEach(rank => {
            if (rank !== Rank.FLAG && rank !== Rank.BOMB)
                for (let i = 0; i < Rank.properties[rank].quantity; i++)
                    pieces.push(new Piece(color, rank));
        });

        return pieces;
    }
}

export default Piece