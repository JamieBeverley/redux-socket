import {createAction} from 'redux-actions';

const defaultServerMetadata = metadata => {
    metadata = metadata || {};
    const rxws = metadata.rxws || {}
    return {
        ...metadata,
        rxws: {
            ...rxws,
            fromServer: true
        }
    }
};

export const ServerActions = {
    RXWS_CLIENT_CONNECTED: {
        name: "RXWS_CLIENT_CONNECTED",
        action: createAction("RXWS_CLIENT_CONNECTED", x=>x, defaultServerMetadata)
    },
    RXWS_CLIENT_DISCONNECTED: {
        name: "RXWS_CLIENT_CONNECTED",
        action: createAction("RXWS_CLIENT_CONNECTED", x=>x, defaultServerMetadata)
    },
    RXWS_LOAD_FROM_SERVER: {
        name: "RXWS_LOAD_FROM_SERVER",
        action: createAction("RXWS_LOAD_FROM_SERVER", x=>x, defaultServerMetadata)
    },
    RXWS_RECEIVE_STATE: {
        name: "RXWS_RECEIVE_STATE",
        action: createAction("RXWS_RECEIVE_STATE", x=>x, defaultServerMetadata)
    },
    RXWD_PROVIDE_STATE:{
        name:"RXWD_PROVIDE_STATE",
        action: createAction("RXWD_PROVIDE_STATE", x=>x, defaultServerMetadata)
    }
}



const defaultClientSelfMetadata = (metadata) => {
    metadata = metadata || {};
    const rxws = metadata.rxws || {}
    return {
        ...metadata,
        rxws:{
            ...rxws,
            self:true
        }
    }
}

export const  ClientActions = {
    RXWS_SELF_CONNECTED :{
        name: "RXWS_SELF_CONNECTED",
        action: createAction("RXWS_SELF_CONNECTED", x=>x, defaultClientSelfMetadata)
    },
    RXWS_SELF_DISCONNECTED :{
        name: "RXWS_SELF_DISCONNECTED",
        action: createAction("RXWS_SELF_DISCONNECTED", x=>x, defaultClientSelfMetadata)
    },
    RXWS_SELF_ERROR :{
        name: "RXWS_SELF_ERROR",
        action: createAction("RXWS_SELF_ERROR", x=>x, defaultClientSelfMetadata)
    },
    RXWS_CLIENT_CONNECTED :{
        name: "RXWS_CLIENT_CONNECTED",
        action: createAction("RXWS_CLIENT_CONNECTED", x=>x, ()=>{})
    },
    RXWS_CLIENT_DISCONNECTED :{
        name: "RXWS_CLIENT_DISCONNECTED",
        action: createAction("RXWS_CLIENT_DISCONNECTED", x=>x, ()=>{})
    },
    RXWS_CLIENT_ERROR :{
        name: "RXWS_CLIENT_ERROR",
        action: createAction("RXWS_CLIENT_ERROR", x=>x, ()=>{})
    },
    RXWS_AUTHENTICATE :{
        name: "RXWS_AUTHENTICATE",
        // Metadata special here, to is set to none so server doesn't try to broadcast pwd to others...
        action: createAction("RXWS_AUTHENTICATE", x=>x, ()=>({rxws:{propagateToServer:true, to:[]}}))
    },
    RXWS_REQUEST_STATE: {
        name:"RXWS_REQUEST_STATE",
        action: createAction("RXWS_REQUEST_STATE", x=>x , x=>({rxws:{propagateToServer: true, to:[]}}))
    }
};
