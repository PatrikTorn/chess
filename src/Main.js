import React from 'react';
import App from './App';
import TicTacToe from './TicTacToe';
import Slot from './Slot';
import './Main.css';
const apps = [
    {
        name:'Ristinolla',
        app:<TicTacToe />
    },
    {
        name:'Shakki',
        app:<App />
    },
    {
        name:'Kasino',
        app:<Slot />
    }
];
export default class Main extends React.Component {
    state = {
        screen:null
    }
    goApp({app}){
        this.setState({
            screen:app
        })
    }
    render(){
        return <App/>
        return (
            <div className="container">
            {/* <div className="goback">M</div> */}
                {this.state.screen ||
                <div className="items">
                    {apps.map(app => (
                        <button className="buttoni" onClick={() => this.goApp(app)}>{app.name}</button>
                    ))}
                </div>
                }
            </div>
        )
    }
}