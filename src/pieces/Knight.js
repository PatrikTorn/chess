import Piece from './Piece';


export default class Knight extends Piece {
    constructor(isWhite, ri, ci){
        super(isWhite, ri, ci);
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.marker = isWhite ? "Kn" : "kn";
        this.rank = 3;
        this.type = "knight";
        this.icon = require(`../images/pieces/Kn_${isWhite ? 'white' : 'black'}.png`);
        this.evalution = isWhite ? 30 : -30;

        const positionRanks = [
            [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
            [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
            [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
            [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
            [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
            [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
            [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
            [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
        ];
        this.positionRanks = isWhite ? positionRanks : positionRanks.slice().reverse();


    }

    getLines({board, activeLines, chessLines}){
        let lines = [];
        if(this.ri < board.length-1){
            this.ci < board.length-2 && lines.push(board[this.ri+1][this.ci+2])
            this.ci > 1 && lines.push(board[this.ri+1][this.ci-2])
        }

        if(this.ri < board.length-2){
            this.ci > 0 && lines.push(board[this.ri+2][this.ci-1])
            this.ci < board.length-1 && lines.push(board[this.ri+2][this.ci+1])
        }

        if(this.ri > 0){
            this.ci < board.length-2 &&lines.push(board[this.ri-1][this.ci+2])
            this.ci > 1 && lines.push(board[this.ri-1][this.ci-2])
        }

        if(this.ri > 1){
            this.ci < board.length-1 && lines.push(board[this.ri-2][this.ci+1])
            this.ci > 0 && lines.push(board[this.ri-2][this.ci-1])
        }
        const possibleLines = lines.filter(p => p.marker && p.isWhite !== this.isWhite || !p.marker);
        this.lines = possibleLines;
        this.protectLines = lines;
        // return possibleLines;
        this.limitChessLines({chessLines, possibleLines, board})
    }
}