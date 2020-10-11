import {createClientMiddleware} from "./middleware/client";
import {createServerMiddleWare} from './middleware/server';
import {ServerActions, ClientActions} from './actions';

const RXWS = {
    createClientMiddleware,
    createServerMiddleWare,
    actions:{
        ClientActions, ServerActions
    }
};
export default RXWS;

// ReduxWebsocket = {
//     wsMessageType:'@@__redux_ws_message'
// };
//
// function clientMiddleware (store){
//     return function(next){
//         return function(action){
//
//         }
//     }
// }
//
// const client = websocket => store => {
//     const oldOnMessage = websocket.onMessage;
//     // Message received from server, set meta from server to true
//     websocket.onMessage = function(event){
//         const message = JSON.parse(event.data);
//         if(message.type===ReduxWebsocket.wsMessageType){
//             const action = message.action;
//             action.meta = Object.assign(action.meta, {reduxWebsocekt:{fromServer:true}});
//             store.dispatch(action)
//         } else{
//             console.warn('Unrecognized message type from WS server: '+message.type, message);
//         }
//         // If there's another on message defined here already, call it
//         if(typeof (oldOnMessage)==='function'){
//             oldOnMessage.call(websocket, event);
//         }
//     };
//     // TODO on error dispatch a custom event?
//
//     return next => action => {
//         return next(action)
//     }
// };
//
//
//
//
//
// // function client (websocket){
// //
// //     const oldOnMessage = websocket.onMessage;
// //     // Message received from server, set meta from server to true
// //     websocket.onMessage = function(event){
// //         const message = JSON.parse(event.data);
// //         if(message.type==='action'){
// //             const action = message.action;
// //             action.meta = Object.assign(action.meta, {fromServer:true});
// //             store.dispatch(action)
// //         } else{
// //             console.warn('Unrecognized message type from WS server: '+message.type, message);
// //         }
// //         // If there's another on message defined here already, call it
// //         if(typeof (oldOnMessage)==='function'){
// //             oldOnMessage.call(websocket,event);
// //         }
// //     };
// // }
//
//
// const clientMiddleware = store => next => action => {
//
// }