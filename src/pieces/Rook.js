import Piece from './Piece';
export default class Rook extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.marker = isWhite ? "R" : "r";
        this.rank = 5;
        this.type = "rook";
        this.icon = require(`../images/pieces/R_${isWhite ? 'white' : 'black'}.png`);
        this.evalution = isWhite ? 50 : -50;

        const positionRanks = [
            [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
            [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
            [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
        ];
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();

    }

    getLines({board, activeLines, chessLines}){
        const straight = this.getStraightLines(board);
        this.lines = straight.possibleLines;
        this.protectLines = straight.protectLines;
        this.mateSector = straight.mateSector || [];
        const possibleLines = straight.possibleLines;
        // return straight.possibleLines;
        this.limitChessLines({chessLines, possibleLines, board})
    }
}
