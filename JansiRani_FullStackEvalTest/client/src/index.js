import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import MainComponent from './Components/MainComponent';
import configureStore from '../src/redux/store';
import TransactionDetail from './Components/TransactionDetail';
import { Router, Route, hashHistory } from 'react-router';

const initialState = {
    transactionList: [],
    updateList: [],
    selectedTransaction: {},
    hashValue: '',

};

const store = configureStore(initialState);

render(
    <Provider store={store}>

        <Router history={hashHistory}>
            <div>
                <Route exact path="/transaction" render={() => (<h4>select a transaction</h4>)} />
                <Route exact path="/transaction/:transactionHash" component={TransactionDetail} />
                <Route exact path="/" component={MainComponent} />

            </div>
        </Router>


    </Provider>,
    document.getElementById('root'),
);
registerServiceWorker();

