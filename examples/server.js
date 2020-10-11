import http from 'http';
import WebSocket from 'ws';
import RXWS from '../src/index.js'
import {applyMiddleware, createStore} from 'redux';
import sharedReducer from "./reducer";

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
const store = createStore(sharedReducer, applyMiddleware(RXWS.createServerMiddleWare(wss), minimalLogger));
console.log("running")
