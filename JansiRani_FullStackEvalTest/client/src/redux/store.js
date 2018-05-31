import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';

import reducer from './reducer';

const finalCreateStore = compose(applyMiddleware(logger))(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(reducer, initialState);
}
