import {wrapAction, executeMaybe} from '../util'
import {ClientActions, ServerActions} from '../actions'
import {RXWSMessageIdentifier} from '../constants';


export const createServerMiddleWare = (wsServer, options) => store => {

    // TODO clean this so not nested...
    class WsClient {
        constructor(ws) {
            this.id = WsClient.ids++;
            this.authenticated = options.pwd === undefined;
            WsClient.clients[this.id] = this;
            this.ws = ws;
        }

        sendAction(action) {
            if (this.authenticated) {
                this.ws.send(JSON.stringify(wrapAction(action)))
            } else {
                console.warn("Client", this.id, "not authenticated for action", action.type)
            }
        }

        delete() {
            delete WsClient.clients[this.id]
        }
    }

    WsClient.ids = 0;
    WsClient.clients = {};
    WsClient.broadcastAction = (action, to) => {
        console.log("broadcasting to ", to);
        console.log(WsClient.clients);
        to.forEach(id => {
            const client = WsClient.clients[id];
            try {
                console.log("sending to ", id);
                client.sendAction(action);
            } catch (e) {
                console.error(e);
            }
        });
    };


    const old = {
        onConnection: executeMaybe(wsServer.onConnection).bind(wsServer),
        onClientMessage: executeMaybe(wsServer.onClientMessage).bind(wsServer),
        onClientClose: executeMaybe(wsServer.onClientClose).bind(wsServer)
    };

    function onClientMessage(data) {
        const msg = JSON.parse(data);
        if (msg.type === RXWSMessageIdentifier) {
            // Append clientId to actions rxws metadata.
            // Important that 'issuer' is assigned here, otherwise middleware will propagate back to issuer.
            msg.action.meta = {...msg.action.meta, rxws: {...msg.action.meta.rxws, issuer: this.id}};
            store.dispatch(msg.action);
        } else {
            console.warn('Unrecognized ws message type: ', msg.type, JSON.stringify(data));
        }
        old.onClientMessage(data);
    }

    function onClientClose(...args) {
        this.delete();
        const action = ServerActions.RXWS_CLIENT_DISCONNECTED.action({clientId: this.id});
        store.dispatch(action);
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
        // if (action.type === ServerActions.RXWS_LOAD_FROM_SERVER.name) {
        //     const state = {...store.getState()};
        //     const action = ServerActions.RXWS_RECEIVE_STATE.action({state});
        //     const client = WsClient.clients[action.meta.rxws.issuer];
        //     client.sendAction(action);
        // }
        const rxws = getMetaRXWS(action)

        if (action.type === ClientActions.RXWS_AUTHENTICATE.name && action.payload === options.pwd) {
            const issuer = getMetaRXWS(action).issuer;
            const client = WsClient.clients[issuer];
            client.authenticated = true;
        }

        let to = rxws.to || "all"; // is broadcasting an appropriate default?
        to = to === "all" ? Object.keys(WsClient.clients) : to;
        to = to.filter(x => x !== rxws.issuer || rxws.issuer === undefined);
        WsClient.broadcastAction(action, to);

        return next(action)
    }
};

const getMetaRXWS = function (action) {
    return ((action.meta || {}).rxws || {})
}


//
