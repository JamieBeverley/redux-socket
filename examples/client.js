import sharedReducer, {Actions} from './reducer';
import React, {Component} from 'react';
import {Provider,connect} from "react-redux";
import {render} from 'react-dom'
import {applyMiddleware, createStore} from "redux";
import RXWS from "../src";
import logger from 'redux-logger'

const port = 9001;
const ws = new WebSocket(`ws://localhost:${port}`)
ws.onopen = () => {console.log("ws: onopen")}
ws.onerror = () => {console.log("ws: onerror")}
ws.onclose = () => {console.log("ws: onclose")}

const store = createStore(sharedReducer, applyMiddleware(RXWS.createClientMiddleware(ws), logger));

const root = document.createElement('div');
document.body.appendChild(root);

class App extends Component {
    constructor(props) {
        super(props);
    }

    updateText(e){
        console.log("updateText");
        store.dispatch(Actions.EDIT_TEXT.action(e.target.value))
    }

    updateNumber(e){
        console.log('update number');
        store.dispatch(Actions.EDIT_NUMBER.action(e.target.value));
    }

    updateOtherObject(e){
        console.warn('not yet implemented')
    }

    render (){
        const state = JSON.stringify(this.props);
        return (
            <div>
                <input onChange={this.updateText.bind(this)} id="text" value = {this.props.text}/>
                <input onChange={this.updateNumber.bind(this)} id="number" value = {this.props.number}/>
                <input onChange={this.updateOtherObject.bind(this)} id="otherObject" value = {this.props.otherObject}/>
            </div>
        )
    }
}
const ConnectedApp = connect(x=>x)(App)
render(<Provider store={store}><ConnectedApp/></Provider>, root);
