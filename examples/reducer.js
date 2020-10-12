import {createAction} from "redux-actions";

const defaultRXWSMetaCreator = metadata => {
    metadata = metadata || {};

    return {
        ...metadata,
        rxws: {
            ...(metadata.rxws ? metadata.rxws : {}),
            propagateToServer: true,
            to: "all"
        }
    }
}

export const Actions = {
    "EDIT_SHARED_VALUE": {
        name: "EDIT_TEXT",
        action: createAction("EDIT_TEXT", x => x, defaultRXWSMetaCreator)
    },
    "EDIT_LOCAL_VALUE": {
        name: "EDIT_LOCAL_VALUE",
        action: createAction("EDIT_LOCAL_VALUE", x => x)
    },
    "EDIT_SERVER_VALUE": {
        name: "EDIT_SERVER_VALUE",
        action: createAction("EDIT_SERVER_VALUE", x => x, defaultRXWSMetaCreator)
    }
}


const defaultState = {
    shared_value: "this will update across all connected clients",
    local_value: "this won't propagate to other clients.",
    server_value: 0
}

function sharedReducer(state = defaultState, action) {

    if (action.type === Actions.EDIT_SHARED_VALUE.name) {
        return {...state, shared_value: action.payload};
    } else if (action.type === Actions.EDIT_LOCAL_VALUE.name) {
        return {...state, local_value: action.payload};
    } else if (action.type === Actions.EDIT_SERVER_VALUE.name) {
        return {...state, server_value: action.payload};
    }

    console.warn("unrecognized action", action.type)
    return state;
}

export default sharedReducer;
