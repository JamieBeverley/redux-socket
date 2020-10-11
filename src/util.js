
export const wrapAction = (action) => ({
    action,
    type: ReduxWebsocket.wsMessageType
});

export const executeMaybe = (f) => {
    if(typeof(f)==="function") {
        return f;
    }
    return () => {}
}

export const addToActionMetaRxws = (action, values) => {
    action = {...action};
    action.meta = {...action.meta};
    action.meta.rxws = {...action.meta.rxws, ...values};
    return action;
};

export const defaultServerMetadata = {
    rxws: {
        fromServer: true
    }
};
