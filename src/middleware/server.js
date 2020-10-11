import {wrapAction, executeMaybe} from '../util'
import {ServerActions} from '../actions'
import {RXWSMessageIdentifier} from '../constants';

class WsClient {
    constructor(ws) {
        this.id = WsClient.ids++;
        WsClient.clients[this.id] = this;
        this.ws = ws;
    }

    sendAction(action) {
        this.ws.send(JSON.stringify(wrapAction(action)))
    }

    delete(){
        delete WsClient.clients[this.id]
    }
}
WsClient.ids = 0;
WsClient.clients = {};
WsClient.broadcastAction = (action, exclude=[]) => {
    console.log("broadcasting to all but", exclude)
    console.log(WsClient.clients);
    Object.values(WsClient.clients).forEach(client=>{
        try{
            console.log("sending to", client.id);
            if(!exclude.includes(client.id)){
                client.sendAction(action);
            }
        } catch (e){
            console.error(e);
        }
    });
};

export const createServerMiddleWare = (wsServer, options) => store => {

    const old = {
        onConnection: executeMaybe(wsServer.onConnection).bind(wsServer),
        onClientMessage: executeMaybe(wsServer.onClientMessage).bind(wsServer),
        onClientClose: executeMaybe(wsServer.onClientClose).bind(wsServer)
    };

    function onClientMessage(data) {
        const msg = JSON.parse(data);
        if (msg.type === RXWSMessageIdentifier) {
            // Append clientId to actions rxws metadata.
            msg.action.meta = {...msg.action.meta, rxws:{...msg.action.meta.rxws, issuer: this.id}};
            store.dispatch(msg.action);
            WsClient.broadcastAction(msg.action, [this.id]);
        } else {
            console.warn('Unrecognized ws message type: ', msg.type, JSON.stringify(data));
        }
        old.onClientMessage(data);
    }

    function onClientClose(...args) {
        this.delete();
        const action = ServerActions.RXWS_CLIENT_DISCONNECTED.action({clientId: this.id});
        store.dispatch(action);
        WsClient.broadcastAction(action)
        old.onClientClose(...args);
    }

    wsServer.on('connection', function (ws) {
        const client = new WsClient(ws);
        ws.on('message', onClientMessage.bind(client));
        ws.on('close', onClientClose.bind(client));
        const action = ServerActions.RXWS_CLIENT_CONNECTED.action({clientId: client.id});
        store.dispatch(action);
        old.onConnection.call(this, ws);
    }.bind(wsServer));

    return next => action => {
        if (action.type === ServerActions.RXWS_LOAD_FROM_SERVER.name) {
            const state = {...store.getState()};
            const action = ServerActions.RXWS_RECEIVE_STATE.action({state});
            const client = WsClient.clients[action.meta.rxws.issuer];
            client.sendAction(action);
        }
        return next(action);
    }
};


















//
