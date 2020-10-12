import http from 'http';
import WebSocket from 'ws';
import RXWS from '../src/index.js'
import {applyMiddleware, createStore} from 'redux';
import sharedReducer, {Actions} from "./reducer";
import {debug} from "webpack";

const minimalLogger = store => next => action =>{
    const result = next(action)
    const msg = `${action.type}  - ${JSON.stringify(store.getState()).substring(0, 300)}`
    console.log('\x1b[36m%s\x1b[0m', msg);  //cyan
    return result
}

const port = 9001
const server = http.createServer();
console.log(server);
const wss = new WebSocket.Server({ server });
server.listen(9001)
const store = createStore(sharedReducer, applyMiddleware(RXWS.createServerMiddleWare(wss, {pwd:'pwd'}), minimalLogger));

// Some value updated from server-side and sent to connected clients
setInterval(()=>{
    const state = store.getState();
    const server_value = state.server_value + 1;
    const action = Actions.EDIT_SERVER_VALUE.action(server_value);
    store.dispatch(action);
}, 1000);

console.log("running")
