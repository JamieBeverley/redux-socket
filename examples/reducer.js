import {createAction} from "redux-actions";
import {createStore, applyMiddleware} from 'redux';
import RXWS from "../src/index"

const defaultRXWSMetaCreator = metadata => {
    metadata = metadata || {};
    return {
        ...metadata,
        rxws: {
            ...(metadata.rxws?metadata.rxws:{}),
            propagateToServer: true
        }
    }
}

export const Actions = {
    "EDIT_TEXT": {
        name: "EDIT_TEXT",
        action: createAction("EDIT_TEXT", x=>x, defaultRXWSMetaCreator)
    },
    "EDIT_NUMBER": {
        name: "EDIT_NUMBER",
        action: createAction("EDIT_NUMBER", x=>x, defaultRXWSMetaCreator)
    },
    "EDIT_OTHER_OBJECT": {
        name: "EDIT_OTHER_OBJECT",
        action: createAction("EDIT_OTHER_OBJECT", x=>x, defaultRXWSMetaCreator)
    }
}


const defaultState = {
    text: "",
    number: 1,
    otherObject: {
        a: null,
        b: 2,
    }
}

function sharedReducer(state = defaultState, action) {
    if (action.type === Actions.EDIT_NUMBER.name) {
        return {...state, number: action.payload};
    } else if (action.type === Actions.EDIT_TEXT.name) {
        return {...state, text: action.payload};

    } else if (action.type === Actions.EDIT_OTHER_OBJECT.name) {
        return {...state, otherObject: action.payload}

    } else {
        console.warn(`unrecognized action...${action.type}`)
        return state
    }
}

export default sharedReducer;
