import {RXWSMessageIdentifier} from './constants'

export const wrapAction = (action) => ({
    action,
    type: RXWSMessageIdentifier
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
