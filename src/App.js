import React from 'react'
import {Piece, King, Queen, Rook, Bishop, Knight, Pawn} from './pieces';
import './App.css'
// const AI_DEPTH = 2;
// const BOT_IS_WHITE = true;
// const DEBUG = false;

export default class Chess extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            board_small:[
                [new Rook(false),new Queen(false),new King(false),new Rook(false)],
                [new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false)],
                [new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true)],
                [new Rook(true),new Queen(true),new King(true),new Rook(true)]
            ],
            board_middle:[
              [new Rook(false), new Knight(false), new Queen(false),new King(false), new Bishop(false), new Rook(false)],
              [new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false)],
              [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
              [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
              [new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true), new Pawn(true), new Pawn(true)],
              [new Rook(true), new Bishop(true), new Queen(true),new King(true), new Knight(true), new Rook(true)]
            ],
            board_big: [
                [new Rook(false), new Knight(false), new Bishop(false), new Queen(false), new King(false), new Bishop(false), new Knight(false), new Rook(false)],
                [new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false), new Pawn(false),new Pawn(false),new Pawn(false),new Pawn(false)],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
                [new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true), new Pawn(true),new Pawn(true),new Pawn(true),new Pawn(true)],
                [new Rook(true), new Knight(true), new Bishop(true), new Queen(true), new King(true), new Bishop(true), new Knight(true), new Rook(true)]
            ],
            board_test:[
              [new Piece(), new Rook(false), new Piece(), new Piece()],
              [new Piece(), new Piece(), new Piece(), new Bishop(false)],
              [new Piece(),new Piece(),new Piece(),new Piece()],
              [new Queen(true), new Pawn(true), new Piece(), new Piece()] 
            ],

            testBoard: [
              [new Rook(false),new Piece(), new Piece()],
              [new Knight(false), new Piece(), new Bishop(false)],
              [ new Piece(), new Bishop(true), new Piece()]
            ],
            from:null,
            to:null,
            isWhiteTurn:true,
            activeLines:[],
            chessLines:[],
            possibleLines:{
              white:[],
              black:[]
            },
            possibleIterations:[],
            showMenu:false,
            BOT_IS_WHITE:true,
            DEBUG:false,
            AI_DEPTH:3
        }
        this.state.board = this.state.board_middle;
        this.setCoords(this.state.board);
    }

    componentDidMount(){
      this.initGame();
    }


    

    initGame(){
      new Promise((resolve) => {
        this.getPossibleLines();
        // possibleLines.white.map(p => {

        // })
        // const {attacker, target} = possibleLines.white[0];
        // const newBoard = this.uglyMove(target.ri, target.ci, attacker.ri, attacker.ci, this.state.board);
        // console.log(newBoard);
        // console.log(this.state.board);
        // const possibleIterations = this.minimax3(possibleLines, this.state.board, this.state.BOT_IS_WHITE, this.state.AI_DEPTH, -9999, 9999);
        // this.formatPossibleIterations(possibleIterations);
        resolve();
      }).then(() => {
        if(!this.state.DEBUG){
          if(this.state.BOT_IS_WHITE){
            this.moveBot();
          }
        }
      })
    }



    

    minimax(depth, {newBoard, possibleLines}, isMaximisingPlayer, alpha, beta){
      if (depth === 0) {
          return {
            score:this.evaluate(newBoard)
          }
      }
      var newGameMoves = possibleLines;
      if (isMaximisingPlayer) {
          var bestMove = {
            score:-9999,
            index:-1
          };
          for (var i = 0; i < newGameMoves.white.length; i++) {
              let {attacker, target} = newGameMoves.white[i];
              let newIt = this.uglyMove(target.ri, target.ci, attacker.ri, attacker.ci, newBoard);
              
              let best = this.minimax(depth - 1, newIt, !isMaximisingPlayer, alpha, beta);

              if(best.score > bestMove.score){
                bestMove = {
                  score:best.score,
                  index:i
                }
              }
              alpha = Math.max(alpha, bestMove.score);
              if(beta <= alpha){
                console.log("Alpha")
                return bestMove
              }
          }
          return bestMove;
      } else {
          var bestMove = {
            score:9999,
            index:-1
          }
          for (var i = 0; i < newGameMoves.black.length; i++) {
              let {attacker, target} = newGameMoves.black[i];
              let newIt = this.uglyMove(target.ri, target.ci, attacker.ri, attacker.ci, newBoard);
              let best = this.minimax(depth - 1, newIt, !isMaximisingPlayer, alpha, beta);

              if(best.score < bestMove.score){
                bestMove = {
                  score:best.score,
                  index:i
                }
              }
              beta = Math.min(beta, bestMove.score);
              if (beta <= alpha) {
                  console.log("Beta")
                  return bestMove;
              }
          }
          return bestMove;
      }
  };

    uglyMove(rowIndex, columnIndex, fromRi, fromCi, board){
        const newBoard = board.map((row, ri) => row.map((col, ci) => {
          if(ri === rowIndex && ci === columnIndex){
            return board[fromRi][fromCi]
          }else if(ri === fromRi && ci === fromCi){
            return new Piece();
          }else{
            return col;
          }
        }));  
        newBoard[fromRi][fromCi].hasMoved = true;
        const chessLines = this.setChessLines(newBoard);
        const activeLines = this.setActiveLines(newBoard);
        newBoard.map((row, ri) => {
          row.map((p, ci) => {
            p.setCoords(ri, ci);
            p.getLines({board:newBoard, activeLines, chessLines});
          })
        });
        const possibleLines = this.getPossibleLines(newBoard);
        return {board, newBoard, possibleLines};
    }


    setCoords(board){
        (board || this.state.board).map((r, ri) => r.map((p, ci) => {
            p.setCoords(ri, ci);
        }));
        board || this.setState({board});
    }



    move(rowIndex, columnIndex, fromRi, fromCi){
      return new Promise((resolve) => {
        console.log("MOVE!" , {rowIndex, columnIndex, fromRi, fromCi})
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
          
        }else if(fromPiece.type === "pawn" && rowIndex === board.length-1){
          board[rowIndex][columnIndex] = new Queen(false);
          board[from.ri][from.ci] = new Piece();
          
        }else{
          board[rowIndex][columnIndex] = board[from.ri][from.ci];
          board[from.ri][from.ci] = new Piece();
        }
  
        board[rowIndex][columnIndex].hasMoved = true;
        const chessLines = this.setChessLines(board);
        const activeLines = this.setActiveLines(board);
        board.map((row, ri) => {
          row.map((p, ci) => {
            p.setCoords(ri, ci);
            p.getLines({board, activeLines, chessLines});
          })
        });

        this.setState({
            to:null, 
            from:null,
            board,
            isWhiteTurn:!isWhiteTurn
        })
        const possibleLines = this.getPossibleLines(board);
        resolve(possibleLines)
      })
    }

    isPossibleMove(ri, ci){
      const {from, board} = this.state;
      return from && board[from.ri][from.ci].lines.find(p => p.ri === ri && p.ci === ci)
    }

    onClickPiece(rowIndex, columnIndex){
      const {board, activeLines, chessLines, from, isWhiteTurn, DEBUG, BOT_IS_WHITE} = this.state;
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

          // if(DEBUG){
          //   return this.move(rowIndex, columnIndex)
          // }
          if(DEBUG || this.isPossibleMove(rowIndex, columnIndex)){
            this.move(rowIndex, columnIndex).then((possibleLines) => {
              if(!DEBUG){
                setTimeout(() => {
                  if(this.state.isWhiteTurn === BOT_IS_WHITE){
                    // const possibleIterations = this.minimax3(possibleLines, this.state.board, this.state.BOT_IS_WHITE, this.state.AI_DEPTH, -9999, 9999);
                    // this.formatPossibleIterations(possibleIterations);
                  }
                  this.moveBot();
                  this.setState({isWhiteTurn:!this.state.BOT_IS_WHITE});
                }, 50);
              }
            })



          }else{
            console.log("not possible move")
          }
        }

      // From has not set
      }else {
        const coords = {
          ri:rowIndex,
          ci:columnIndex
        };
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

    setChessLines(newBoard){
      const board = newBoard || this.state.board;
      const pieces = this.getPieces(board);
      let chessLines = [];
      for(let attacker of pieces){
        for(let target of attacker.lines){
          if(target.type === "king"){
            chessLines.push({target, attacker});
          }
        }
      }
      newBoard || this.setState({chessLines});
      return chessLines
    }

    setActiveLines(newBoard){
      const board = newBoard || this.state.board;
      const pieces = this.getPieces(board);
      let activeLines = [];
      for(let piece of pieces){
          for(let line of piece.protectLines){
            activeLines.push({target:line, attacker:piece});
          }
      }
      newBoard || this.setState({activeLines});
      return activeLines
    }

    createBoard({board, attacker, target}){
      const PIECES = (isWhite, ri, ci) => ({
        king: new King(isWhite, ri, ci),
        queen: new Queen(isWhite, ri, ci),
        rook: new Rook(isWhite, ri, ci),
        bishop: new Bishop(isWhite, ri, ci),
        knight: new Knight(isWhite, ri, ci),
        pawn: new Pawn(isWhite, ri, ci),
        empty: new Piece(isWhite, ri, ci)
      })
      const newBoard = board.map((row, ri) => {
        return row.map((piece, ci) => {
          if(ri === attacker.ri && ci === attacker.ci){
            return new Piece(false, ri, ci);

          }else if(ri === target.ri && ci === target.ci){
            return PIECES(attacker.isWhite, ri, ci)[attacker.type]
          }
          else{
            return PIECES(piece.isWhite, ri, ci)[piece.type]
          }
        });
      });
      return newBoard;
    }

    evaluate(board){
      const pieces = this.getPieces(board);
      let evalution = 0;
      for(let piece of pieces){
        evalution += piece.evalution;
      }
      return evalution
    }


    getPossibleLines(newBoard){
      const board = newBoard || this.state.board;
      const pieces = this.getPieces(board);
      let possibleLines = {
        white:[],
        black:[]
      };
      
      const chessLines = this.setChessLines(board);
      const activeLines = this.setActiveLines(board);
      board.map((row, ri) => {
        row.map((p, ci) => {
          p.setCoords(ri, ci);
          p.getLines({board, activeLines, chessLines});
        })
      })

      for(let attacker of pieces){
        for(let target of attacker.lines){
          // Set possibleLines lines
          possibleLines[attacker.isWhite ? 'white' : 'black'].push({
            target, 
            attacker,
            positionWin: attacker.positionRanks[target.ri][target.ci]
          });
        }
      }
      
      newBoard || this.setState({possibleLines});
      return possibleLines
    }


    formatPossibleIterations(possibleIterations){
      const {BOT_IS_WHITE} = this.state
      const player = BOT_IS_WHITE ? 'black' : 'white';
      
      // possibleIterations = possibleIterations
      // .map(it => {
      //   const optims = this.getMini2(it, it.attacker.isWhite, {lineCounts:{black:[], white:[]}, evalutions:[]})
      //   return({
      //     min:optims.min,
      //     max:optims.max,
      //     positionWin:it.attacker.positionRanks[it.target.ri][it.target.ci] - it.attacker.positionRanks[it.attacker.ri][it.attacker.ci],
      //     lineCounts:optims.lineCounts,
      //     ...it,
      //   })
      // })
      // .filter(p => p.lineCounts[BOT_IS_WHITE ? 'white' : 'black'] !== 0)
      // .sort((a,b) => 
      //   (a.lineCounts[player] === 0 &&  b.lineCounts[player] === 0) || 
      //   (BOT_IS_WHITE ? (b.min - a.min || b.max-a.max) : (a.min - b.min || a.max-b.max) ) || 
      //   (BOT_IS_WHITE ? b.evaluation-a.evaluation :a.evaluation - b.evaluation) || 
      //   (b.positionWin - a.positionWin)
      // );
      // *0.9 + (b.worstLineCount - a.worstLineCount)*0.1
      this.setState({possibleIterations});
    }

    moveBot(){
      // const {possibleIterations, possibleLines} = this.state;
      // const posBot = possibleLines[this.state.BOT_IS_WHITE ? 'white' : 'black'];
      const possibleLines = this.getPossibleLines();
      const best = this.minimax(this.state.AI_DEPTH, {newBoard:this.state.board, possibleLines}, this.state.BOT_IS_WHITE, -9999, 9999);
      
      if(best.index === -1){
        alert("Shakkimatti")
      }else{
        const bestMove = possibleLines[this.state.BOT_IS_WHITE ? 'white' : 'black'][best.index];
        console.log(possibleLines);
        console.log('best', best);
        console.log(bestMove);

        let from = {
          ri:bestMove.attacker.ri,
          ci:bestMove.attacker.ci
        }
        let to = {
          ri:bestMove.target.ri,
          ci:bestMove.target.ci
        }
        this.move(to.ri, to.ci, from.ri, from.ci);
      }


      // let from, to;
      // if(posBot.length > 0){
      //   if(possibleIterations.length > 0 ){
      //     const best = possibleIterations[0];
      //     from = {
      //       ri:best.attacker.ri,
      //       ci:best.attacker.ci
      //     }
      //     to = {
      //       ri:best.target.ri,
      //       ci:best.target.ci
      //     }
      //     this.move(to.ri, to.ci, from.ri, from.ci);
      //   }else{
      //     alert("Shakkimatti");
          // const random = posBot[Math.floor(Math.random()*posBot.length)];
          // from = {
          //   ri:random.attacker.ri,
          //   ci:random.attacker.ci
          // }
          // to = {
          //   ri:random.target.ri,
          //   ci:random.target.ci
          // }
      //   }

      // }else{
      //   alert("Shakkimatti");
      // }
    }

    renderBoard(board, isMini){
      const {from, activeLines, possibleLines} = this.state;
      const isActive = (ri, ci) => from && from.ri === ri && from.ci === ci;
      return(
        <div className={isMini ? "board-mini" : "board"}>
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
                        isMini:true
                      })}
                      onClick={() => this.onClickPiece(ri, ci)}
                    ></div>
                ))}
            </div>
            ))
          }
      </div>
      )
    }

    toggleMenu(){
      this.setState({showMenu:!this.state.showMenu})
    }

    startGame(mode){

      switch(mode){
        case 'small':
          this.setState({board:this.state.board_small})
          break;
        case 'middle':
          this.setState({board:this.state.board_middle})
          break;
        case 'big':
          this.setState({board:this.state.board_big})
          break;
      }
      this.setState({isWhiteTurn:true});
      this.toggleMenu();
      this.initGame();
    }

    render(){
        console.log('state', this.state);
        const {board, from, possibleIterations, BOT_IS_WHITE} = this.state;
        const isActive = (ri, ci) => from && from.ri === ri && from.ci === ci;
        const evaluation = this.evaluate(this.state.board)/10;
        
        return this.state.showMenu ? 
        (
          <div style={styles.wrapper}>
              <div style={styles.menu} onClick={() => this.toggleMenu()}>?</div>
              <button onClick={() => this.setState({BOT_IS_WHITE:false})}>Pelaa valkeilla</button>
              <button onClick={() => this.setState({BOT_IS_WHITE:true})}>Pelaa mustilla</button>
              <button onClick={() => this.startGame('small')}>Minishakki</button>
              <button onClick={() => this.startGame('normal')}>Keskishakki</button>
              <button onClick={() => this.startGame('big')}>Normishakki</button>

              {/* {
                possibleIterations.map(it => 
                  <div style={{display:'flex', flexDirection:'row'}}>
                  <div style={{flex:0.5}}>{this.renderBoard(this.state.board, true)}</div>
                    <div style={{flex:0.5}}>{this.renderBoard(it.board, true)}</div>
                    <div style={{flex:0.5}}>{it.next[0] && this.renderBoard(it.next[0].board, true)}</div>
                    <div style={{flex:0.5}}>{it.next[0].next[0] && this.renderBoard(it.next[0].next[0].board, true)}</div>
                  </div>
                )
              } */}
          </div>
        )
        : (
          <div style={styles.wrapper} className="wrapper">
            <div style={styles.menu} onClick={() => this.toggleMenu()}>?</div> 
            <div style={styles.container}>
                <div style={styles.details}>
                    <div>{BOT_IS_WHITE ? 'Minä' : 'PatsiBot'} ({-evaluation >= 0 && '+'}{-evaluation})</div>
                    {!this.state.isWhiteTurn && !BOT_IS_WHITE && <div>Miettii....</div>}
                </div>
                {this.renderBoard(board, false)}
                <div style={styles.details}>
                    <div>{BOT_IS_WHITE ? 'PatsiBot' : 'Minä'} ({evaluation >= 0 && '+'}{evaluation})</div>
                    {this.state.isWhiteTurn && BOT_IS_WHITE && <div>Miettii....</div>}
                </div>
            </div>
          </div>
        )
    }
}

const styles = {
    wrapper:{
      position:'absolute',
      left:0,
      top:0,
      right:0,
      bottom:0,
      backgroundColor:'#404040',
    },
    container:{
      position:'relative',
      top:0,
      left:0,
      right:0,
      bottom:0,
      margin:'auto',
      display:'table',
    },
    menu:{
      position:'fixed',
      top:10,
      left:10,
      width:30,
      height:30,
      backgroundColor:'rgba(255,255,255,0.3)',
      borderRadius:5,
      textAlign:'center',
      fontSize:22,
      color:'white',
      cursor:'pointer'
    },
    details:{
      backgroundColor:'#2F4F4F',
      width:'70vh',
      height:'10vh',
      display:'table-row',
      color:'white',
      textAlign:'center'
    },
    row:{
        display:'table-row'
    },
    piece:({possible, active, dark, background, activeLineWhite, activeLineBlack, isMini}) =>  ({
        width:isMini ? 20 :60,
        height:isMini ? 20 : 60,
        // backgroundColor: activeLineWhite && activeLineBlack ? 'gray' : (activeLineBlack ? 'darkgray' : (activeLineWhite ? 'white' : 'orange')),
        backgroundColor: active ? '#ffffff' : (possible ? '#baca44' : dark ? '#769656' : '#eeeed2'),
        backgroundImage: `url(${background})`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        borderRight:'1px solid black',
        borderBottom:'1px solid black',
        display:'table-cell',
        lineHeight:'100px',
        textAlign:'center',
        cursor:'pointer'
    })
}