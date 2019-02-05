import Piece from './Piece';

export default class Pawn extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.marker = isWhite ? "P" : "p";
        this.rank = 1;
        this.type = "pawn";
        this.icon = require(`../images/pieces/P_${isWhite ? 'white' : 'black'}.png`);
        this.evalution = isWhite ? 10 : -10;
        const positionRanks =
        [
            [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
            [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
            [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
            [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
            [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
            [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
            [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
        ];
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();
          
        //   p.positionRanks = p.isWhite ? p.positionRanks : reverseArray(p.positionRanks);


    }
    
    getLines({board, activeLines, chessLines}){
        const LAST_INDEX = board.length - 1;
        const lastOwnRow = this.isWhite ? 0 : LAST_INDEX;
        if(this.ri === lastOwnRow){
            return []
        }
        let lines = [];
        let protectLines = [];
        const inc = this.isWhite ? -1 : 1;
        const nextRow = this.ri + inc;
        const topRight = board[nextRow][this.ci+1];
        const topLeft = board[nextRow][this.ci-1];
        const top = board[nextRow][this.ci];
        const canWhite = this.isWhite && this.ri === board.length - 2;
        const canBlack = !this.isWhite && this.ri === 1;
        const secondRow = (canWhite || canBlack) && board[this.ri+(2*inc)][this.ci]

        // Walk forward
        if(!top.marker){
            lines.push(top)
        }

        // Walk two steps in first time
        if(secondRow && !secondRow.marker && !top.marker){
            lines.push(secondRow);
        }

        // Eat al pasant
        // TODO


        // Eat right
        if(this.ci !== LAST_INDEX && topRight.marker && topRight.isWhite !== this.isWhite){
            lines.push(topRight);
        }

        if(this.ci !== LAST_INDEX){
            protectLines.push(topRight);
        }

        if(this.ci !== 0 ){
            protectLines.push(topLeft);
        }

        // Eat left
        if(this.ci !== 0 && topLeft.marker && topLeft.isWhite !== this.isWhite){
            lines.push(topLeft);
        }



        const possibleLines = lines;
        this.lines = lines;
        this.protectLines = protectLines;
        this.limitChessLines({chessLines, possibleLines, board})
        

        // if(chessPieces.length === 1){
        //     this.lines = this.lines.filter(line => chessPieces[0].attacker.box === line.box);
        //     return this.lines;
        // }else if(chessPieces.length > 1){
        //     this.lines = [];
        // }







    }
}