import sharedReducer, {Actions} from './reducer';
import React, {Component} from 'react';
import {Provider, connect} from "react-redux";
import {render} from 'react-dom'
import {applyMiddleware, createStore} from "redux";
import RXWS from "../src";
import logger from 'redux-logger'

// Create a ws connection to localhost 9001
const port = 9001;
const ws = new WebSocket(`ws://localhost:${port}`)
ws.onopen = () => {
    console.log("ws: onopen")
}
ws.onerror = () => {
    console.log("ws: onerror")
}
ws.onclose = () => {
    console.log("ws: onclose")
}

// Create a store with the RXWS client middleware
//
const store = createStore(sharedReducer, applyMiddleware(RXWS.createClientMiddleware(ws), logger));

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: ''
        }
    }

    authenticate(e) {
        const pwd = e.target.value;
        this.setState({pwd})
        const action = RXWS.actions.ClientActions.RXWS_AUTHENTICATE.action(pwd);
        store.dispatch(action);
    }

    updateSharedValue(e) {
        store.dispatch(Actions.EDIT_SHARED_VALUE.action(e.target.value))
    }

    updateLocalValue(e) {
        store.dispatch(Actions.EDIT_LOCAL_VALUE.action(e.target.value));
    }

    render() {
        return (
            <div>
                <h1>RXWS</h1>
                <div>
                    <input onChange={this.authenticate.bind(this)} value={this.state.pwd}/>
                </div>
                <div>
                    <input onChange={this.updateSharedValue.bind(this)} id="text" value={this.props.shared_value}/>
                </div>
                <div>
                    <input onChange={this.updateLocalValue.bind(this)} id="number" value={this.props.local_value}/>
                </div>
                <div>
                    Some value updated from server: {this.props.server_value}
                </div>
            </div>
        )
    }
}

const ConnectedApp = connect(x => x)(App)

const root = document.createElement('div');
document.body.appendChild(root);

render(<Provider store={store}>
    <ConnectedApp/>
</Provider>, root);
