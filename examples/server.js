import http from 'http';
import WebSocket from 'ws';
import RXWS from '../src/index.js'
import {applyMiddleware, createStore} from 'redux';
import sharedReducer, {Actions} from "./reducer";

const port = 9001
const server = http.createServer();
const wss = new WebSocket.Server({server});
server.listen(port)

const serverMiddlware = RXWS.createServerMiddleWare(
    wss, // the created websocket server
    {pwd: 'pwd'}, // config options (currently just a 'pwd' option)
    // optional middleware function to be called for each action (this case a simple logger)
    (store, action) => {
        console.log('\x1b[36m%s\x1b[0m', action.type);
    });

const store = createStore(sharedReducer, applyMiddleware(serverMiddlware));

// Some value updated from server-side and sent to connected clients
setInterval(() => {
    const state = store.getState();
    const server_value = state.server_value + 1;
    const action = Actions.EDIT_SERVER_VALUE.action(server_value);
    store.dispatch(action);
}, 1000);

console.log("Running WSServer, waiting for connections...")
