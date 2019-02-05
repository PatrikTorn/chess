import Piece from './Piece';

export default class Bishop extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.marker = isWhite ? "B" : "b";
        this.rank = 3.5;
        this.type = "bishop";
        this.icon = require(`../images/pieces/B_${isWhite ? 'white' : 'black'}.png`);
        this.evalution = isWhite ? 30 : -30;

        const positionRanks = [
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
            [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
            [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
            [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
            [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
            [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
            [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
        ];
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();

    }
    

    getLines({board, activeLines, chessLines}){
        const diagonal = this.getDiagonalLines(board);
        this.lines = diagonal.possibleLines;
        this.protectLines = diagonal.protectLines;
        this.mateSector = diagonal.mateSector || [];
        const possibleLines = diagonal.possibleLines;
        // return diagonal.possibleLines;
        this.limitChessLines({chessLines, possibleLines, board});
    }
}
