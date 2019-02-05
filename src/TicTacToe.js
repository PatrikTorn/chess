import React from 'react';
const X = "X";
const O = "O";
const N = null;
const huPlayer = X;
const aiPlayer = O;
const botIsX = aiPlayer === X
const winLines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const createBoard = (board) => {
    let newBoard = [];
    let row = [];
    for(let i=0;i<board.length;i++){
        let item = (board[i] === X || board[i] === O) ? board[i] : N; 
        row.push({index:i, item});
        if((i+1) % 3 === 0){
            newBoard.push(row);
            row = [];
        }
    }
    return newBoard;
}

const getWinner = (game, player) => {
    let won = false;
    winLines.map(([a,b,c]) => {
        if(game[a] === player && game[b] === player && game[c] === player){
            won = true;
        }
    });
    return won;
}

const freeIndexes = (game) => game.filter(p => p !== O && p !== X);

let c = 0;
const minimax = (newBoard, player) => {
    c++;
    var availSpots = freeIndexes(newBoard);

    if(getWinner(newBoard, aiPlayer)){
        return {score:10}
    }else if(getWinner(newBoard, huPlayer)){
        return {score:-10}
    }else if (availSpots.length === 0){
        return {score:0}
    }
    
    const moves = availSpots.map(availSpot => {
      var move = {};
      move.index = availSpot;
      newBoard[availSpot] = player;
      if (player == aiPlayer){
        var result = minimax(newBoard, huPlayer);
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }
      newBoard[availSpot] = move.index;
      return move
    })


    let bestMove;
    if(player === aiPlayer){
      let bestScore = -10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
  
    let bestScore = 10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove]
  }

  const games = {
      test:[
        O,1,X,
        X,4,X,
        6,O,O
      ],
      empty:[
        0,1,2,
        3,4,5,
        6,7,8
    ],
    test2:[
        0,X,2,
        3,4,O,
        6,7,8
    ]
  }

export default class TicTacToe extends React.Component {
    state = {
        game:games.empty,
        count:0
    }

    componentDidMount(){
        if(botIsX){
            this.move(4, aiPlayer);
        }
    }

    resetGame(end){
        this.setState({
            game:games.empty
        });

    }

    onClick(i){
        if(this.state.game[i] === X || this.state.game[i] === O){
            return;
        }
        this.move(i, huPlayer)
        .then(newGame => {
            this.moveBot(newGame)
        })
        .catch(end => {
            this.resetGame(end);
        })

    }

    move(i, player){
        return new Promise((resolve, reject) => {
            const newGame = this.state.game.map((p, index) => index === i ? player : p)
            const gameEnded = getWinner(newGame, player);
            console.log({newGame, gameEnded});
            this.state.game[i] = player;
            this.setState({
                game:newGame,
            });
            if(gameEnded){
                reject(player + ' voitti pelin');
            }else if(newGame.filter(p => p === X || p === O).length === 9){
                reject("Tasapeli");
            }else{
                resolve(newGame);
            }
        });


    }

    moveBot(newGame){
        const bestMove = minimax(newGame, aiPlayer);
        this.move(bestMove.index, aiPlayer)
        .catch(end => {
            this.resetGame(end);
        });
    }

    render(){
        console.log(this.state);
        const game = createBoard(this.state.game);
        return(
            <center>
                
                <div style={styles.table}>
                {
                    game.map((row, ri) => 
                        <div key={ri} style={styles.row}>
                            {row.map(({index, item}, ci) => 
                                <div 
                                    key={ci} 
                                    onClick={() => this.onClick(index)} 
                                    style={styles.box((ri+ci) % 2 === 0)}>
                                    {item}
                                </div>
                            )}
                        </div>
                    )
                }
                </div>
            </center>

        )
    }
}

const styles = {
    table: {
        display:'table'
    },
    row: {
        display:'table-row'
    },
    box: (stripe) => ({
        display:'table-cell',
        width:200,
        height:200,
        backgroundColor: stripe ? '#e0e0e0' : 'lightgray',
        border:'1px solid darkgray',
        textAlign:'center',
        fontSize:60,
        cursor:'pointer'
    })
}