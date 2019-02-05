import Piece from './Piece';

export default class King extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];

        this.marker = isWhite ? "K" : "k";
        this.rank = 90;
        this.icon = require(`../images/pieces/K_${isWhite ? 'white' : 'black'}.png`);
        this.type = "king";
        this.evalution = isWhite ? 900 : -900;
        const positionRanks = [
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
            [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
            [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
            [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
            [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
        ];
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();
        }
        
    
    getLines({board, activeLines, chessLines, possibleLines}){
        const LAST_INDEX = board.length - 1;
        const inc = this.isWhite ? -1 : 1;
        const nextRow = this.ri + inc;
        const prevRow = this.ri - inc;
        const firstOwnRow = this.isWhite ? LAST_INDEX : 0;
        const lastOwnRow = this.isWhite ? 0 : LAST_INDEX;
        let lines = [];
        
        // Straight movements
        this.ri !== lastOwnRow && lines.push(board[nextRow][this.ci])
        this.ri !== firstOwnRow && lines.push(board[prevRow][this.ci]) 

        // Right movements
        if(this.ci !== LAST_INDEX){
            this.ri !== lastOwnRow && lines.push(board[nextRow][this.ci+1])
            lines.push(board[this.ri][this.ci+1])
            this.ri !== firstOwnRow && lines.push(board[prevRow][this.ci+1]) 
        }

        // Left movements
        if(this.ci !== 0){
            this.ri !== lastOwnRow && lines.push(board[nextRow][this.ci-1])
            lines.push(board[this.ri][this.ci-1])
            this.ri !== firstOwnRow && lines.push(board[prevRow][this.ci-1]) 
        }


        let possible = lines
            .filter(p => (p.marker && p.isWhite !== this.isWhite) || !p.marker)
            .filter(p => !activeLines.find(({target, attacker}) => p.box === target.box && attacker.isWhite !== this.isWhite))


        for(let attacker of this.threatLines){
            if(attacker.type === "pawn"){
                let index = possible.findIndex(p => p.box === attacker.box && attacker.protectLines.length > 0);
                index !== -1 && possible.splice(index, 1);
            }
        }

        if(board.length === 8 && !activeLines.find(({target, attacker}) => this.box === target.box && attacker.isWhite !== this.isWhite)){
        // Castling
            if(!this.hasMoved){
                // TODO check lines between them
                const rightRook = board[this.ri][this.ci+3]
                const leftRook = board[this.ri][this.ci-4];
                if(rightRook){
                    // Short castling
                    if(!board[this.ri][this.ci+1].marker && !board[this.ri][this.ci+2].marker){
                        if(!rightRook.hasMoved)
                            possible.push(board[this.ri][this.ci+2]);
                    }
                }

                if(leftRook){
                // Long castling
                    if(!board[this.ri][this.ci-1].marker && !board[this.ri][this.ci-2].marker && !board[this.ri][this.ci-3].marker){
                        if(!leftRook.hasMoved)
                        possible.push(board[this.ri][this.ci-2]);
                    }
                }

            }
        }


        this.lines = possible;
        this.protectLines = lines;
        return possible
    }
    
}
