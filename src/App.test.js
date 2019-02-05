import React from 'react'
import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from './pieces';

export default class Chess extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            boarda:[
                [new Rook(false),new Queen(false),new King(false),new Rook(false)],
                [new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false)],
                [new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true)],
                [new Rook(true),new Queen(true),new King(true),new Rook(true)]
            ],
            board: [
                [new Rook(false), new Knight(false), new Bishop(false), new Queen(false), new King(false), new Bishop(false), new Knight(false), new Rook(false)],
                [new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false), new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false)],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true), new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true)],
                [new Rook(true), new Knight(true), new Bishop(true), new Queen(true), new King(true), new Bishop(true), new Knight(true), new Rook(true)]
            ],
            boardtetst: [
              [new Rook(false), new Piece(), new Piece()],
              [new Knight(false), new Piece(), new Bishop(false)],
              [new Piece(), new Bishop(true), new Piece()]
            ],
            from:null,
            to:null,
            isWhiteTurn:true,
            activeLines:[],
            chessLines:[],
            evalution:0,
            possibleLines:{
              white:[],
              black:[]
            },
            bestTree:{
              white:[],
              black:[]
            }


        }
    }

    componentDidMount(){
      this.updatePieces();
      const possibleLines = this.setPossibleLines();
      // this.minimax(possibleLines);
    }

    updatePieces(state){
        const {board, activeLines, chessLines, possibleLines} = state || this.state;

        board.map((r, ri) => r.map((p, ci) => {
            p.setCoords(ri, ci);
            p.getLines({board, activeLines, chessLines, possibleLines});

        }));
        state || this.setState({board});
    }

    move(rowIndex, columnIndex, fromRi, fromCi){
      return new Promise((resolve, reject) => {
        console.log("ASDSAD" , {rowIndex, columnIndex, fromRi, fromCi})
        let {from, board, isWhiteTurn} = this.state;
        if(fromRi > -1 && fromCi > -1){
          from = {
            ri:fromRi,
            ci:fromCi
          }
        }
        const fromPiece = board[from.ri][from.ci];
        const toPiece = board[rowIndex][columnIndex];
        if(fromPiece.type === "king"){
          board[rowIndex][columnIndex] = fromPiece;
          board[from.ri][from.ci] = new Piece();
          const isWhite = board[rowIndex][columnIndex].isWhite;
          const LAST_ROW = isWhite ? 7 : 0;
          const LAST_COLUMN = 7;
  
          // Short castling
          if(toPiece.ci - fromPiece.ci === 2){
            board[rowIndex][columnIndex-1] = board[LAST_ROW][LAST_COLUMN]
            board[LAST_ROW][LAST_COLUMN] = new Piece();
  
          // Long castling
          }else if(toPiece.ci - fromPiece.ci === -2){
            board[rowIndex][columnIndex+1] = board[LAST_ROW][0]
            board[LAST_ROW][0] = new Piece();
          }
        }else if(fromPiece.type === "pawn" && rowIndex === 0){
          board[rowIndex][columnIndex] = new Queen(true);
          board[from.ri][from.ci] = new Piece();
          
        }else{
          board[rowIndex][columnIndex] = board[from.ri][from.ci];
          board[from.ri][from.ci] = new Piece();
        }
  
        board[rowIndex][columnIndex].hasMoved = true;
        this.updatePieces();
        const possibleLines = this.setPossibleLines();

        const bestmoves = this.minimax(possibleLines);
        console.log({bestmoves});
  
        this.setState({
            to:null, 
            from:null,
            board,
            isWhiteTurn:!isWhiteTurn
        })
        
        
        return resolve()
      })

    }

    isPossibleMove(ri, ci){
      // TODO: Not here, but diagonal-3: q,Kn,K
      const {from, board} = this.state;
      return from && board[from.ri][from.ci].lines.find(p => p.ri === ri && p.ci === ci)
    }

    onClickPiece(rowIndex, columnIndex){
      const DEBUG = true;
      const {board, activeLines, chessLines, from, isWhiteTurn} = this.state;
      const fromPiece = board[rowIndex][columnIndex];
      // Not your turn
      if(!DEBUG && !from && (fromPiece.isWhite !== isWhiteTurn || !fromPiece.marker)){
        console.log("ASD")
        return
      }

      // From has set
      if(from){
        // Clicked same piece twice
        if(rowIndex === from.ri && columnIndex === from.ci){
          this.setState({from:null});
        }else{

          if(DEBUG){
            return this.move(rowIndex, columnIndex)
          }
          if(this.isPossibleMove(rowIndex, columnIndex)){
            this.move(rowIndex, columnIndex)
            .then(() => {
              this.moveBot();
              this.setState({isWhiteTurn:true})
            })

          }
        }

      // From has not set
      }else {
        const coords = {
          ri:rowIndex,
          ci:columnIndex
        };
        board[rowIndex][columnIndex].getLines({board, activeLines, chessLines});
        this.setState({from:coords})
      }


    }

    getPieces(board = this.state.board){
      return board.reduce((acc, row) => {
        row.map(p => {
          acc.push(p);  
        });
        return acc;
      }, []);
    }

    setChessLines(board = this.state.board){
      const pieces = this.getPieces(board);
      let chessLines = [];
      for(let attacker of pieces){
        for(let target of attacker.lines){
          if(target.type === "king"){
            chessLines.push({target, attacker});
          }
        }
      }
      this.setState({chessLines});
      return chessLines
    }

    setActiveLines(board = this.state.board){
      const pieces = this.getPieces(board);
      let activeLines = [];
      for(let piece of pieces){
          for(let line of piece.protectLines){
            activeLines.push({target:line, attacker:piece});
          }
      }
      this.setState({activeLines});
      return activeLines
    }

    setPossibleLines(board = this.state.board){
      console.log({board});
      const pieces = this.getPieces(board);
      let possibleLines = {
        white:[],
        black:[]
      };
      const activeLines = this.setActiveLines(board);
      const chessLines = this.setChessLines(board);
      for(let piece of pieces){
        piece.threatLines = [];
      }
      for(let piece of pieces){
        piece.getLines({board, activeLines, chessLines});

        for(let line of piece.lines){
            if(line.marker){
              pieces.find(p => p.box === line.box).isThreated = true;
              line.threatLines.push(piece);
            }
            possibleLines[piece.isWhite ? 'white' : 'black'].push({
              target:line, 
              attacker:piece,
              win:this.calculateWin({attacker:piece, target:line})
            });
        }
      }
      // console.log({possibleLines})

      this.setState({possibleLines});
      if(possibleLines.black.length === 0 || possibleLines.white.length === 0){
        alert("Shakkimatti!")
      }
      return possibleLines;
    }

    minimax(possibleLines){
      const color = this.state.isWhiteTurn ? 'white' : 'black';
      const bestTree = possibleLines[color].map((p, i) => {
        const {attacker, target} = p;
        const board = this.state.board.map((row, ri) => {
          return row.map((piece, ci) => {
            if(ri === attacker.ri && ci === attacker.ci){
              return new Piece(false, ri, ci);

            }else if(ri === target.ri && ci === target.ci){
              return attacker
            }
            else{
              return piece
            }
          });
        });
        board.map((row, ri) => {
          row.map((p, ci) => {
            p.setCoords(ri, ci);
          })
        })
        // const board = this.state.board;
        // board[attacker.ri][attacker.ci] = new Piece();
        // board[target.ri][target.ci] = attacker;
        const activeLines = this.setActiveLines(board);
        const chessLines = this.setChessLines(board);
        // this.setPossibleLines(board);
        this.updatePieces({board, activeLines, chessLines, possibleLines:this.setPossibleLines(board)});

        return({
          evalution:this.evaluate(board),
          board,
          possible:this.setPossibleLines(board)[color],
          attacker,
          target
        })

      });
      this.setState({bestTree:{...this.state.bestTree, [color]:bestTree}});
      return bestTree;
    }

    evaluate(board){
      const pieces = this.getPieces(board);
      let evalution = 0;
      for(let piece of pieces){
        evalution += piece.evalution;
      }
      return evalution
    }

    calculateWin({attacker, target}){
      // Immediate win
      let win = 0;
      if(target.marker){
        win = target.rank
      }

      return win;
    }

    moveBot(){
      const possibleLines = this.state.possibleLines.black;
      if(possibleLines.length === 0){
        return
      }
      const random = Math.floor(Math.random()*possibleLines.length);
      let firstPossibleLine = possibleLines.sort((a,b) => b.win-a.win)[0]
      if(firstPossibleLine.win === 0){
        firstPossibleLine = possibleLines[random];
      }

      // const firstPossibleLine = possibleLines[random]
      this.move(firstPossibleLine.target.ri, firstPossibleLine.target.ci, firstPossibleLine.attacker.ri, firstPossibleLine.attacker.ci)
    }

    render(){
        console.log('state', this.state);
        const {board, from, isWhiteTurn, activeLines, possibleLines} = this.state;
        const isActive = (ri, ci) => from && from.ri === ri && from.ci === ci;
        const isThreated = (ri, ci) => board[ri][ci].threatLines.length > 0;
        // <h1>Turn:{isWhiteTurn ? "White" : "Black"} </h1>
        // <p>Possible lines:</p>
        // <div>White: {possibleLines.white.length}</div>
        // <div>Black: {possibleLines.black.length}</div>
        // 
        return(
            <div style={styles.container}>
              <div style={styles.board}>
                    {
                        board.map((row, ri) => (
                            <div style={styles.row} key={ri}>
                                {row.map((piece, ci) => (
                                    <div 
                                        key={ci}
                                        style={styles.piece({
                                            possible:this.isPossibleMove(ri,ci), 
                                            active:isActive(ri,ci),
                                            dark:(ri+ci)%2 === 0,
                                            background:piece.icon,
                                            activeLineWhite:activeLines.find(a => a.attacker.isWhite && a.ri === ri && a.ci === ci),
                                            activeLineBlack:activeLines.find(a => !a.attacker.isWhite && a.ri === ri && a.ci === ci),
                                            isThreated: isThreated(ri, ci)
                                        })}
                                        onClick={() => this.onClickPiece(ri, ci)}
                                      ></div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
      position:'absolute',
      top:0,
      left:0,
      right:0,
      bottom:0,
      backgroundColor:'#404040'
    },
    board:{
        backgroundColor:'gray',
        width:'100vh',
        height:'100vh',
        display:'table',
    },
    row:{
        display:'table-row'
    },
    piece:({possible, active, dark, background, activeLineWhite, activeLineBlack, isThreated}) =>  ({
        width:60,
        height:60,
        // backgroundColor: activeLineWhite && activeLineBlack ? 'gray' : (activeLineBlack ? 'darkgray' : (activeLineWhite ? 'white' : 'orange')),
        backgroundColor: active ? '#ffffff' : (possible ? '#baca44' : dark ? '#769656' : '#eeeed2'),
        // backgroundColor:isThreated ? '#baca44' : '#769656',
        backgroundImage: `url(${background})`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        border:'2px solid black',
        display:'table-cell',
        lineHeight:'100px',
        textAlign:'center',
        cursor:'pointer'
    })
}































minimax3(possibleLines, board, isWhite, depth, a, b){
  let evas3;
  let lineCounts = {
    white:0,
    black:0
  };
  const evas1 = possibleLines[isWhite ? 'white' : 'black'].map(line1 => {
    const board1 = this.createBoard({board, attacker:line1.attacker, target:line1.target})

    const possibleLines2 = this.getPossibleLines(board1);
      if(depth === 0){
        return {
          best:this.evaluate(board1),
          lineCounts:{
            white: possibleLines2.white.length,
            black: possibleLines2.black.length,
          },
          ...line1,
          next:null
        }
      }else{

        const nextIteration = this.minimax3(possibleLines2, board1, !isWhite, depth-1, a, b)
        const best = (isWhite ? Math.min(...nextIteration.map(it3 => it3.best)) : Math.max(...nextIteration.map(it3 => it3.best)));
        if(isWhite){
          a = Math.max(a, best)
          if(a >= b){
            console.log("ALFA", depth);
            // return null 
          }
        }else{
          b = Math.min(b, best)
          if(a >= b){
            console.log("BETA", depth);
        //     return null
          }
        }
        return {
          a,
          b,
          best,
          lineCounts:{
            white: Math.min(...nextIteration.map(it3 => it3.lineCounts.white)),
            black: Math.min(...nextIteration.map(it3 => it3.lineCounts.black)),
          },
          ites:nextIteration.map(it3 => it3.best),
          ...line1,
          next:nextIteration
        }
      }
      
  })
    

  return evas1
  .filter(p => p !== null)
  .sort((a,b) => 
    (isWhite ? b.best - a.best : a.best - b.best) || 
    b.positionWin - a.positionWin ||
    b.lineCounts[isWhite ? 'white' : 'black'] - a.lineCounts[isWhite ? 'white' : 'black'] ||
    a.lineCounts[isWhite ? 'black' : 'white'] - b.lineCounts[isWhite ? 'black' : 'white']
  );
}

minimax2(possibleLines, depth, board, isWhite){
  if(depth === 0){
    return {
      value:this.evaluate(board),
      next:null,
      board
    }
  }
  if (!isWhite) {
    var bestMove = {value:-9999};
    for (var i = 0; i < possibleLines.white.length; i++) {
      const {attacker, target} = possibleLines.white[i];
        const newBoard = this.createBoard({board, attacker, target})
        let uusi1 = this.minimax2(this.getPossibleLines(newBoard), depth - 1, newBoard, !isWhite);
        bestMove = {
          value:Math.max(bestMove.value, uusi1.value),
          attacker,
          target,
          board:newBoard,
          next:uusi1,
          i
        }

    }
    return bestMove;
} else {
    var bestMove = {value:9999};
    for (var i = 0; i < possibleLines.black.length; i++) {
        const {attacker, target} = possibleLines.black[i];
        const newBoard = this.createBoard({board, attacker, target})
        let uusi2 = this.minimax2(this.getPossibleLines(newBoard), depth - 1, newBoard, !isWhite);
        bestMove = {
          value:Math.min(bestMove.value, uusi2.value),
          attacker,
          target,
          board:newBoard,
          next:uusi2,
          i
        }
    }
    return bestMove;
}
}




minimax(possibleLines, depth, board, isWhite, bestEvaluation){
  if(depth === 0){
    const posLines = this.getPossibleLines(board);
    return {
      lineCount:{
        white:posLines.white.length,
        black:posLines.black.length
      },
    }
  }
  const getBest = (evaluation) => isWhite ? Math.max(-9999, evaluation) : Math.min(9999, evaluation);
  const possibleIterations = possibleLines[isWhite ? 'white' : 'black'].map(({attacker, target}) => {
    const newBoard = this.createBoard({board, attacker, target});
    const posLines = this.getPossibleLines(newBoard);

    return {
      bestEvaluation:getBest(this.evaluate(newBoard)),
      evaluation:this.evaluate(newBoard),
      lineCount:{
        white:posLines.white.length,
        black:posLines.black.length
      },
      posLines,
      attacker:attacker,
      target:target,
      next:this.minimax(posLines, depth - 1, newBoard, !isWhite, bestEvaluation),
      board:newBoard
    }
  });
  return possibleIterations
}




getMini2(root, isWhite, optims){
  optims.evalutions.push(root.evaluation);
  optims.lineCounts.white.push(root.lineCount.white)
  optims.lineCounts.black.push(root.lineCount.black)
  const next = root.next;
  if(root.next.length > 0){
  for(let iteration of next){
      optims.lineCounts.white.push(iteration.lineCount.white)
      optims.lineCounts.black.push(iteration.lineCount.black)
      optims.evalutions.push(iteration.evaluation);
      if(iteration.next){
        this.getMini2(iteration, isWhite, optims);
      }
    }
  }
  return {
    min:Math.min(...optims.evalutions),
    max:Math.max(...optims.evalutions),
    lineCounts:{
      white:Math.min(...optims.lineCounts.white),
      black:Math.min(...optims.lineCounts.black)
    }
  }
}

getMini(it1, isWhite){
  let retVal = [];
  for(let it2 of it1.next){
    retVal.push(it2.evaluation);
    if(it2.next.next){
      for(let it3 of it2.next){
        retVal.push(it3.evaluation);
      }
    }
  }
  
  if(isWhite){
    return Math.min(...retVal);
  }else{
    return Math.max(...retVal);
  }

}