import {defaultMeta, defaultServerMetadata} from "./util";
import {createAction} from 'redux-actions';

export const ServerActions = {
    RXWS_CLIENT_CONNECTED: {
        name: "RXWS_CLIENT_CONNECTED",
        action: createAction("RXWS_CLIENT_CONNECTED", x=>x, ()=> defaultServerMetadata)
    },
    RXWS_LOAD_FROM_SERVER: {
        name: "RXWS_LOAD_FROM_SERVER",
        action: createAction("RXWS_LOAD_FROM_SERVER", x=>x, () => defaultServerMetadata)
    },
    RXWS_RECEIVE_STATE: {
        name: "RXWS_RECEIVE_STATE",
        action: createAction("RXWS_RECEIVE_STATE", x=>x, () => defaultServerMetadata)
    }
}



const defaultClientSelfMetadata = (metadata) => {
    return {
        ...metadata,
        rxws:{
            ...metadata.rxws,
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
    }
};