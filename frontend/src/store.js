import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

//reducers
const reducer = combineReducers({});

//initial values in store
const initialState = {};


const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools([...middleware]));

export default store;