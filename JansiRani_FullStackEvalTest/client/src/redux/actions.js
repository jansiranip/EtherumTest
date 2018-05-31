const actions = {
    addTransactions(transactions) {
        return {
            type: 'ADD_TRANSACTIONS',
            transactions,
        };
    },
    updateTransactions(transactions) {
        return {
            type: 'UPDATE_TRANSACTIONS',
            transactions,
        };
    },
    addSelectedTransaction(selectedTransaction) {
        return {
            type: 'ADD_SELECTED_TRANSACTION',
            selectedTransaction,
        };
    },
    updateBookmarkSelectedTransaction(hashValue) {
        return {
            type: 'UPDATE_BOOKMARK_SELECTED_TRANSACTION',
            hashValue,
        };
    },
    updateBlacklistkSelectedTransaction(hashValue) {
        return {
            type: 'UPDATE_BLACKLIST_SELECTED_TRANSACTION',
            hashValue,
        };
    },
    
};

export default actions;
