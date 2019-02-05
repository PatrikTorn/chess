import React from 'react';

class Cherry {
    constructor(){
        this.mark = "cherry";
        this.winTable = {
            1:0,
            2:0,
            3:20,
            4:60,
            5:120
        }
        this.image = require('./images/slots/cherry.png')
    }
}

class Grape {
    constructor(){
        this.mark = "grape";
        this.image = require('./images/slots/grape.png')
        this.winTable = {
            1:0,
            2:0,
            3:40,
            4:90,
            5:240
        }
    }
}

class Orange {
    constructor(){
        this.mark = 3;
        this.image = require('./images/slots/orange.png')
        this.winTable = {
            1:0,
            2:0,
            3:80,
            4:140,
            5:500
        }
    }
}


class Seven {
    constructor(){
        this.mark = 4;
        this.image = require('./images/slots/seven.png')
        this.winTable = {
            1:0,
            2:0,
            3:150,
            4:300,
            5:900
        }
    }
}

class Jackpot {
    constructor(){
        this.mark = 5;
        this.image = require('./images/slots/jackpot.png')
        this.winTable = {
            1:0,
            2:0,
            3:400,
            4:1200,
            5:3000
        }
    }
}

const marks = [
    new Cherry(), 
    new Grape(), 
    new Orange(),
    new Seven(),
    new Jackpot()
];
const x = 5;
const y = 3;

function createSlot(){
    let slot = [];
    for(let i=0;i<y;i++){
        let row = [];
        for(let j=0;j<x;j++){
            const newMark = marks[Math.floor(Math.random()*marks.length)];
            row.push(newMark);
        }
        slot.push(row);
    }
    return slot;
}

function getWinLines(slot){
    let lines = [];
    let diagonal = [];
    for(let ri=0;ri<y;ri++){
        let horizontal = [];
        for(let ci=0;ci<x;ci++){
            horizontal.push([ri, ci]);
            if(ri === ci){
                diagonal.push([ri, ci]);
            }
        }
        lines = [...lines, horizontal];
    }

    let diagonal2 = diagonal.map(([ri, ci]) => [(y-1)-ri, ci]);

    lines = [...lines, diagonal, diagonal2];
    return lines
        .map(line => line.map(box => slot[box[0]][box[1]]))
        .map(line => (getLineDetails(line)));
}
function getLineDetails(line){
    let count = 0;
    if(line.length > 0){
        let i = -1;
        do {
            i++
            count++;
          }while (line[i+1] && line[i].mark === line[i+1].mark);
    }
    return {
        count,
        mark:line[0].mark,
        win:line[0].winTable[count]
    };
}

export default class Slot extends React.Component {
    state = {
        slot:createSlot(),
        money:500,
        win:0,
        bet:50,
        showWin:false,
        animating:false
    }

    slotInterval(){
        return new Promise((resolve) => {
            let i = 0;
            let time = 100;
            const interval = () => {
                this.setState({
                    slot:createSlot()
                })
                time += 100;
                if(time > 500){
                    clearInterval(id);
                    resolve();
                }
            }
            const id = setInterval(interval, 200);    
        })
    }

    animateWin(win){
        this.setState({
            showWin:true
        });
        setTimeout(() => {
            this.setState({
                showWin:false
            }); 
        }, 2000)
    }

    play(){
        this.setState({
            money:this.state.money - this.state.bet,
            animating:true
        });
        this.slotInterval()
        .then(() => {
            const slot = createSlot();
            const lines = getWinLines(slot);
            const win = lines.reduce((acc, line) => acc + line.win, 0);
            win > 0 && this.animateWin(win);
            this.setState({
                slot,
                lines,
                win,
                money:this.state.money + win,
                animating:false
            });
        });

    }

    render(){
        const {money, slot, win, animating} = this.state;
        return (
            <div style={styles.container}>
            {this.state.showWin && <div style={styles.win}>+{win}$</div>}
                <div style={styles.table}>
                {slot.map(row => (
                    <div style={styles.row}>
                        {row.map((mark, ci) => (
                            <div style={styles.mark(mark, ci)}></div>
                        ))}
                    </div>
                ))}
                </div>
                <div style={styles.details}>
                    <div style={styles.money}>Rahaa: {money}</div>
                    <button style={styles.button(animating)} onClick={() => !animating && this.play()}>Pelaa</button>
                </div>
            </div>
        );
    }
}

const styles = {
    container:{
        backgroundColor:'black',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        margin:'auto'
    },
    table: {
        display:'table',
        width:`${30*x}vh`,
        height:'90vh',
        position:'absolute',
        top:0,
        left:0,
        right:0,
        margin:'auto'
    },
    details:{
        width:`${30*x}vh`,
        height:'10vh',
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        margin:'auto',
        backgroundColor:'lightgray',
        display:'inline-block'
    },
    row: {
        display:'table-row'
    },
    mark: (mark, ci) => ({
        display:'table-cell',
        backgroundImage:`url(${mark.image})`,
        backgroundColor:'gray',
        marginLeft:ci === 0 ? 0 : 5,
        width:'auto',
        height:`${(1/y)*100}%`,
        borderLeft:'1px solid white',
        backgroundSize:'cover',
        textAlign:'center',
        lineHeight:'100px'
    }),
    money: {
        fontSize:20,
        display:'inline-block',
        position:'absolute',
        color:'white'
    },
    button: animating => ({
        backgroundColor: animating ? 'darkred' : 'red',
        color: animating ? 'lightgray' : 'white',
        fontSize:30,
        textAlign:'center',
        display:'inline-block',
        height:'100%',
        width:'100%',
        border:0,
        padding:5,
        cursor:'pointer'
    }),
    win:{
        width:'30vh',
        height:'10vh',
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        top:0,
        margin:'auto',
        backgroundColor:'rgba(131,55,0, 0.7)',
        zIndex:3,
        textAlign:'center',
        lineHeight:'10vh',
        color:'white',
        fontSize:35,
        borderRadius:50
    }
}