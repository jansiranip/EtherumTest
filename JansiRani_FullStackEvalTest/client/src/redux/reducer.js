
const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
const ADD_SELECTED_TRANSACTION = 'ADD_SELECTED_TRANSACTION';
const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';
const UPDATE_BOOKMARK_SELECTED_TRANSACTION = 'UPDATE_BOOKMARK_SELECTED_TRANSACTION';
const UPDATE_BLACKLIST_SELECTED_TRANSACTION = 'UPDATE_BLACKLIST_SELECTED_TRANSACTION';
export default function reducer(state, action) {
    switch (action.type) {
    case ADD_TRANSACTIONS:
        return Object.assign({}, state, {
            transactionList: action.transactions,
        });

    case UPDATE_TRANSACTIONS:
        return Object.assign({}, state, {
            updateList: action.transactions,
        });

    case ADD_SELECTED_TRANSACTION:
        return Object.assign({}, state, {
            selectedTransaction: action.selectedTransaction,
        });

    case UPDATE_BOOKMARK_SELECTED_TRANSACTION:
        let transactionList = state.transactionList.map(transaction =>
            ((transaction.hash.toString() === action.hashValue.toString())
                ? (Object.assign(transaction, { IsBookmarked: true }))
                : transaction));
        console.log(transactionList);
        return Object.assign({}, state, { transactionList: [...transactionList] });

    case UPDATE_BLACKLIST_SELECTED_TRANSACTION:
        transactionList = state.transactionList.map(transaction =>
            ((transaction.hash.toString() === action.hashValue.toString())
                ? (Object.assign(transaction, { IsBlacklisted: true }))
                : transaction));
        console.log(transactionList);
        return Object.assign({}, state, { transactionList: [...transactionList] });

    default:
        return state;
    }
}
