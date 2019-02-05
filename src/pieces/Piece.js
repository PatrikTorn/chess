

export default class Piece {
    constructor(isWhite = false, ri, ci){
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = ri > -1 && ri > -1 && boxCell[ci] + boxRow[ri];
        this.ri = ri;
        this.ci = ci;
        this.marker = null;
        this.isWhite = isWhite;
        this.lines = [];
        this.icon = null;
        this.rank = 0;
        this.type = "empty";
        this.hasMoved = false;
        this.protectLines = [];
        this.threatLines = [];
        this.mateSector = [];
        this.evalution = 0;
        this.protectors = [];

        this.positionRanks = this.createEmpty()

    }

    createEmpty(){
        return [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ]
    }

    getSelf(){
        return {
            marker:this.marker,
            isWhite:this.isWhite,
            ri:this.ri,
            ci:this.ci,
            lines:this.lines
        }
    }

    getPieces(board){
        return board.reduce((acc, row) => {
          row.map(p => {
            acc.push(p);  
          });
          return acc;
        }, []);
      }
    
    setCoords(ri, ci){
        const boxCell = ["A","B","C","D","E","F","G","H"];
        const boxRow = ["1","2","3","4","5","6","7","8"].reverse();
        this.box = boxCell[ci] + boxRow[ri];
        this.ri = ri;
        this.ci = ci;
    }

    getSector(sector){
        const obstacles = sector.filter(p => p.marker);
        const firstObstacle = obstacles[0];
        if(firstObstacle){
            const firstObstacleIndex = sector.findIndex(p => p.ci === firstObstacle.ci && p.ri === firstObstacle.ri);
            if(firstObstacle.isWhite === this.isWhite){
                return {
                    possibleLines:sector.filter((p, i) => i < firstObstacleIndex),
                    protectLines:sector.filter((p, i) => i <= firstObstacleIndex),
                    mateSector:sector.find(p => p.type === "king" && p.isWhite !== this.isWhite) ? sector : null
                }
            } else if (firstObstacle.isWhite !== this.isWhite){
                return {
                    possibleLines:sector.filter((p, i) => i <= firstObstacleIndex),
                    protectLines:sector.filter((p, i) => i <= firstObstacleIndex+1),
                    mateSector:sector.find(p => p.type === "king" && p.isWhite !== this.isWhite) ? sector : null
                } 
            }
        }else{
            return {
                possibleLines:sector,
                protectLines:sector,
                mateSector:sector.find(p => p.type === "king" && p.isWhite !== this.isWhite) ? sector : null
            }
        }
    }

    getStraightLines(board){
        let lines = [];
        const ln = board.length;
        
        for(let rowI = 0; rowI < ln; rowI++){
            if(rowI !== this.ri)
                lines.push(board[rowI][this.ci]);
        }
        for(let colI = 0; colI < ln; colI++){
            if(colI !== this.ci)
                lines.push(board[this.ri][colI]);
        }
        const first = this.getSector(lines
            .filter(p => p.ri === this.ri && p.ci > this.ci)
            .sort((a, b) => a.ci - b.ci)
            .map(p => ({...p, sector:1, direction:'straight'})));

        const second = this.getSector(lines
            .filter(p => p.ci === this.ci  && p.ri < this.ri)
            .sort((a, b) => b.ri - a.ri)
            .map(p => ({...p, sector:2, direction:'straight'})));

        const third = this.getSector(lines
            .filter(p => p.ri === this.ri && p.ci < this.ci)
            .sort((a, b) => b.ci - a.ci)
            .map(p => ({...p, sector:3, direction:'straight'})));

        const fourth = this.getSector(lines
            .filter(p => p.ci === this.ci  && p.ri > this.ri)
            .sort((a, b) => a.ri - b.ri)
            .map(p => ({...p, sector:4, direction:'straight'})));

        const possibleLines = [
            ...first.possibleLines,
            ...second.possibleLines,
            ...third.possibleLines,
            ...fourth.possibleLines
        ];

        const protectLines = [
            ...first.protectLines,
            ...second.protectLines,
            ...third.protectLines,
            ...fourth.protectLines
        ];

        const mateSector = first.mateSector || second.mateSector || third.mateSector || fourth.mateSector;

        return {
            possibleLines,
            protectLines,
            mateSector
        }
    }

    getDiagonalLines(board){
        let lines = [];
        board.map(row => {
            row.map(p => {
                const diffRi = this.ri - p.ri;
                const diffCi = this.ci - p.ci;
                if(Math.abs(diffRi) === Math.abs(diffCi)){
                    lines.push(p);
                }
            })
        })
        let first = this.getSector(lines
            .filter(p => this.ri-p.ri > 0 && this.ci-p.ci < 0)
            .sort((a,b) => (this.ri-a.ri) - (this.ri-b.ri))
            .map(p => ({...p, sector:1, direction:'diagonal'})));
        let second = this.getSector(lines
            .filter(p => this.ri-p.ri > 0 && this.ci-p.ci > 0)
            .sort((a,b) => (this.ri-a.ri) - (this.ri-b.ri))
            .map(p => ({...p, sector:2, direction:'diagonal'})));
        let third = this.getSector(lines
            .filter(p => this.ri-p.ri < 0 && this.ci-p.ci > 0)
            .sort((a,b) => (this.ri-b.ri) - (this.ri-a.ri))
            .map(p => ({...p, sector:3, direction:'diagonal'})));
        let fourth = this.getSector(lines
            .filter(p => this.ri-p.ri < 0 && this.ci-p.ci < 0)
            .sort((a,b) => (this.ri-b.ri) - (this.ri-a.ri))
            .map(p => ({...p, sector:4, direction:'diagonal'})));

        const possibleLines = [
            ...first.possibleLines,
            ...second.possibleLines,
            ...third.possibleLines,
            ...fourth.possibleLines
        ];

        const protectLines = [
            ...first.protectLines,
            ...second.protectLines,
            ...third.protectLines,
            ...fourth.protectLines
        ];

        const mateSector = first.mateSector || second.mateSector || third.mateSector || fourth.mateSector || [];

        return {
            possibleLines,
            protectLines,
            mateSector
        }
    }

    limitChessLines({chessLines, possibleLines, board}){
        const chessPieces = chessLines.filter(line => line.target.isWhite === this.isWhite)
        if(chessPieces.length === 1){

            // Get possible lines for pieces to protect the king 
            this.lines = this.lines.filter(line => chessPieces[0].attacker.box === line.box);
            for(let chessLine of chessPieces){
                let sector = chessLine.attacker.mateSector;
                let kingIndex = sector.findIndex(p => p.type === "king");

                sector = sector.filter((p, i) => i < kingIndex);
                
                for(let attackerLine of sector){
                    for(let myLine of possibleLines){
                        if(myLine.box === attackerLine.box){
                            this.lines.push(board[attackerLine.ri][attackerLine.ci]);
                        }
                    }
                }
            }
        }else if(chessPieces.length >1){
            this.lines = [];
        }

        // Prevent piece to move out from sector
        const mateSectors = this.getPieces(board).filter(p => p.mateSector.length > 0).map(p => p.mateSector);
        mateSectors.map(mateSector => {
            const myIndex = mateSector.findIndex(p => p.box === this.box);
            const kingIndex = mateSector.findIndex(p => p.type === "king" && p.isWhite === this.isWhite);
            const nextObstacle = mateSector.findIndex((p, i) => i > myIndex && p.marker)
            const prevObstacle = mateSector.findIndex((p, i) => i < myIndex && p.marker)

            if(kingIndex === nextObstacle && myIndex !== -1 && prevObstacle === -1){
                const mateDirection = mateSector[0].direction;
                const sector = mateSector[0].sector;
                if(mateDirection === 'straight'){
                    if(sector === 1 || sector === 3){
                        this.lines = this.lines.filter(p => p.ri === this.ri);
                    }else{
                        this.lines = this.lines.filter(p => p.ci === this.ci);
                    }

                }else if(mateDirection === 'diagonal'){
                    if(sector === 1){
                        this.lines = this.lines.filter(p => p.ri > this.ri && p.ci < this.ci);
                    }else if(sector === 2){
                        this.lines = this.lines.filter(p => p.ri > this.ri && p.ci > this.ci);
                    }else if(sector === 3){
                        this.lines = this.lines.filter(p => p.ri < this.ri && p.ci > this.ci);
                    }else if(sector === 4){
                        this.lines = this.lines.filter(p => p.ri < this.ri && p.ci < this.ci);
                    }
                }

            }
        }) 
    }


    getLines(){

    }
}
