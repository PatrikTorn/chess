import Piece from './Piece';

export default class Queen extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.marker = isWhite ? "Q" : "q";
        this.rank = 9;
        this.type = "queen";
        this.icon = require(`../images/pieces/Q_${isWhite ? 'white' : 'black'}.png`);
        this.evalution = isWhite ? 90 : -90;

        const positionRanks = [
            [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
            [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
            [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
            [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
            [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
        ];
        
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();
    }

    getLines({board, activeLines, chessLines}){
        const diagonal = this.getDiagonalLines(board);
        const straight = this.getStraightLines(board);

        this.lines = [...diagonal.possibleLines, ...straight.possibleLines];        
        this.protectLines = [...diagonal.protectLines, ...straight.protectLines];
        this.mateSector = straight.mateSector || diagonal.mateSector ||  [];
        const possibleLines = [...diagonal.possibleLines, ...straight.possibleLines];
        this.limitChessLines({chessLines, possibleLines, board})

    }
}

