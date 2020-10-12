import {addToActionMetaRxws, executeMaybe} from '../util'
import {ClientActions} from '../actions'
import {RXWSMessageIdentifier} from "../constants";

export const createClientMiddleware = (websocket, options) => store => {
    const old = ["onmessage", "onclose", "onerror", "onconnect"].reduce((acc,x)=>{
        acc[x] = executeMaybe(websocket[x]).bind(websocket);
        return acc;
    },{});

    websocket.onconnect = function(event){
        const action = ClientActions.RXWS_SELF_CONNECTED.action({self:true});
        store.dispatch(action);
        old.onconnect(event);
    }

    // Message received from server, set meta from server to true
    websocket.onmessage = function(event){
        const message = JSON.parse(event.data);
        if(message.type===RXWSMessageIdentifier){
            // Mark action as from server, and not to propagate it.
            const action = addToActionMetaRxws(message.action,{fromServer:true, propagateToServer: false});
            store.dispatch(action)
        } else{
            console.warn('Unrecognized message type from WS server: '+message.type, message);
        }
        old.onmessage(event);
    };
    websocket.onerror = function(event){
        // TODO what is this event, what would be useful to include in the action?
        const action = ClientActions.RXWS_SELF_ERROR.action({error: event});
        store.dispatch(action);
        old.onerror(event);
    }

    websocket.onclose = function(event){
        const action = ClientActions.RXWS_SELF_DISCONNECTED.action({self:true});
        store.dispatch(action);
        old.onclose(event)
    };

    function sendAction(action){
        const data = {
            type: RXWSMessageIdentifier,
            action: action,
            pwd: (options || {}).pwd
        }
        websocket.send(JSON.stringify(data));
    }

    return next => action => {
        const propagate = ((action.meta || {}).rxws || {}).propagateToServer
        if(propagate){
            sendAction(action);
        }
        // TODO option to only do 'next' if sendAction succeeds?
        return next(action)
    }
};
