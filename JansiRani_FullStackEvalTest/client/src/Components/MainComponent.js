import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { connect } from 'react-redux';
import { Router, Route, Link } from 'react-router';

import PropTypes from 'prop-types';
import actions from '../redux/actions';


class MainComponent extends Component {
    constructor(props) {
        super(props);
        console.log('MapContainer Constructor');
        console.log(this.props);
        this.state = {
            filterKey: 0,
            filterKeyValues: [],
            currentSelection: {},

        };
    }


    componentDidMount() {
        console.log('MapContainer did mount');
        this.retrieveBlocks();
        setInterval(this.checkforupdates, 120000);
    
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage: 1,
        });
    }

    checkforupdates() {
        console.log('checkingforupdates');
        //this.retrieveBlocks;
    }

    // Request
    retrieveBlocks() {
       
        axios.get('http://localhost:5000/')
            .then((response) => {
                console.log(response.data);
                this.renderControls(response.data);
            })
            .catch((e) => {
                console.log('Failed to Connecting to server and Fetch Data');
                console.log(e);
            });
    }
    timeDifference(current, previous) {
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        const elapsed = current - previous;
        // console.log(elapsed);
        if (elapsed < msPerMinute) {
            return `${Math.round(elapsed / 1000)} seconds ago`;
        } else if (elapsed < msPerHour) {
            return `${Math.round(elapsed / msPerMinute)} minutes ago`;
        } else if (elapsed < msPerDay) {
            return `${Math.round(elapsed / msPerHour)} hours ago`;
        } else if (elapsed < msPerMonth) {
            return `${Math.round(elapsed / msPerDay)} days ago`;
        } else if (elapsed < msPerYear) {
            return `${Math.round(elapsed / msPerMonth)} months ago`;
        }


        return `approximately ${Math.round(elapsed / msPerYear)} years ago`;
    }

    addSelectedTransaction(transaction) {
        console.log(transaction);
        if (transaction != undefined) {
            this.props.actions.addSelectedTransaction(transaction);
        }
    }

    handleTransactionSelection(event) {
        console.log((event.target.value));
        const { value } = event.target;
        this.setState({
            currentSelection: value,
        });
    }

    renderTransactions(transactions) {
        console.log('render buttons');
        let txType = '';
        if (transactions !== undefined) {
            return (transactions.map((transaction, index) => {
                if (transaction.IsBookmarked && transaction.IsBlacklisted) {
                    txType = 'BookMarked & BlackListed';
                } else if (transaction.IsBlacklisted || transaction.IsBookmarked) {
                    txType = (transaction.IsBlacklisted && !(transaction.IsBookmarked)) ? 'BlackListed' : 'BookMarked';
                } else {
                    txType = 'Normal';
                }
                return (<tr key={index}>
                    <td><input className="radio" type="radio" id={transaction.hash} value={transaction.hash} checked={this.state.currentSelection == transaction.hash} onChange={this.handleTransactionSelection.bind(this)} /></td>
                    <td><Link to={{ pathname: `/transaction/${transaction.hash}` }} onClick={() => this.addSelectedTransaction(transaction)} >{transaction.hash}</Link></td>
                    <td>{transaction.blockNumber}</td>
                    <td>{transaction.from}</td>
                    <td>{transaction.to}</td>

                    <td>{transaction.txreceipt_status > 0 ? 'Success' : 'Failure'}</td>
                    <td>{this.timeDifference(new Date(), new Date(transaction.timeStamp * 1000))}</td>
                    <td>{txType}</td>
                        </tr>);
            }));
        }
    }


    renderControls(data) {
        console.log('render controls');
        console.log(data.result);
        if (data !== undefined) {
            this.props.actions.addTransactions(data);
            this.props.actions.updateTransactions(data);
        }
    }
    /**
* Renders a pager component.
*/
    pager(page) {
        const pageLinks = [];
        if (page.currentPage > 1) {
            if (page.currentPage > 2) {
                pageLinks.push(<span className="pageLink" key={1} onClick={page.handleClick(1)}>«</span>);
                pageLinks.push(' ');
            }
            pageLinks.push(<span className="pageLink" key={page.currentPage - 1} onClick={page.handleClick(page.currentPage - 1)}>‹</span>);
            pageLinks.push(' ');
        }
        pageLinks.push(<span className="currentPage" key={page.currentPage}>Page {page.currentPage} of {page.numPages}</span>);
        if (page.currentPage < page.numPages) {
            pageLinks.push(' ');
            pageLinks.push(<span className="pageLink" key={page.currentPage + 1} onClick={page.handleClick(page.currentPage + 1)}>›</span>);
            if (page.currentPage < page.numPages - 1) {
                pageLinks.push(' ');
                pageLinks.push(<span className="pageLink" key={page.numPages} onClick={page.handleClick(page.numPages)}>»</span>);
            }
        }
        return <div className="pager">{pageLinks}</div>;
    }

    getPage() {
        const start = 20 * (this.state.currentPage - 1);
        const end = start + 20;

        return {
            currentPage: this.state.currentPage,
            transactions: this.props.transactionList.slice(start, end),
            numPages: this.getNumPages(),
            handleClick: function (pageNum) {
                return function () { this.handlePageChange(pageNum); }.bind(this);
            }.bind(this),
        };
    }

    /**
       * Calculates the total number of pages.
       */
    getNumPages() {
        let numPages = Math.floor(this.props.transactionList.length / 20);
        if (this.props.transactionList.length % 20 > 0) {
            numPages += 1;
        }
        return numPages;
    }

    handlePageChange(pageNum) {
        this.setState({ currentPage: pageNum });
    }

    searchList(event) {
        console.log(event.target.value);

        let updatedList = this.props.transactionList;
        if (event.target.value.length <= 0) {
            updatedList = this.props.updateList;
            this.props.actions.addTransactions(updatedList);
        } else {
            updatedList = updatedList.filter(item =>
                (item.from === (event.target.value) || item.to === (event.target.value) || item.hash === (event.target.value)));
            this.props.actions.addTransactions(updatedList);
        }

        console.log(updatedList);
        // this.setState({items: updatedList});
    }

    filterList(event) {
        console.log(event.target.value);
        const filterKeyValue = event.target.value;
        let updatedList =this.props.updateList;

        if (this.state.filterKey == '1') {
            console.log(this.state.filterKey);
            if (filterKeyValue.toString() === 'BookMarked') {
                console.log('bookmarked');
                axios.get('http://localhost:5000/bookmarkedTransactions')
                    .then((response) => {
                        console.log(response.data);
                        this.props.actions.addTransactions(response.data);
                    })
                    .catch((e) => {
                        console.log('Failed to Connecting to server and Fetch Data');
                        console.log(e);
                    });
            } else if (filterKeyValue.toString() === 'BlackListed') {
                console.log('blacklisted');
                axios.get('http://localhost:5000/blacklistedTransactions')
                    .then((response) => {
                        console.log(response.data);
                        this.props.actions.addTransactions(response.data);
                    })
                    .catch((e) => {
                        console.log('Failed to Connecting to server and Fetch Data');
                        console.log(e);
                    });
            } else {
                this.props.actions.addTransactions(this.props.updateList);
                // console.log(updatedList);
            }
        } else if (this.state.filterKey === '2') {
            console.log('2');

            if (filterKeyValue === 'Success' || filterKeyValue === 'Failure') {
                const input1 = filterKeyValue === 'Success' ? '1' : '0';
                console.log(input1);
                console.log(updatedList);

                updatedList = updatedList.filter(item => (item.txreceipt_status == input1));
                console.log(updatedList);
                if (updatedList.length > 0) {
                    this.props.actions.addTransactions(updatedList);
                } else {
                    this.props.actions.addTransactions([]);
                }
            }
        } else {
            console.log('ELSE');
            updatedList = this.props.updateList;
            this.props.actions.addTransactions(updatedList);
            console.log(updatedList);
        }
    }

    selectFilter(event) {
        console.log(event.target.value);
        const filterKey = event.target.value;
        this.setState({ filterKey });
        if (filterKey === '1') {
            this.setState({ filterKeyValues: ['Please select', 'Normal', 'Internal', 'BookMarked', 'BlackListed'] });
        } else if (filterKey === '2') {
            this.setState({ filterKeyValues: ['Please Select:', 'Success', 'Failure'] });
        }
    }


    populateFilterKeyValues() {
        return (this.state.filterKeyValues.map(bar => (<option value={bar} key={bar}>{bar}</option>)));
    }
    bookmarkTransaction() {
        console.log(this.state.currentSelection);
        axios.put(`http://localhost:5000/bookmark/${this.state.currentSelection}`, { IsBookmarked: true })
            .then((response) => {
                console.log(response);
                console.log(response.data);
                // this.renderControls(response.data);
            })
            .catch((e) => {
                console.log('Failed to Connecting to server and Fetch Data');
                console.log(e);
            });
        this.props.actions.updateBookmarkSelectedTransaction(this.state.currentSelection, 'IsBookmarked');
    }
    blacklistTransaction() {
        console.log(this.state.currentSelection);
        axios.put(`http://localhost:5000/blacklist/${this.state.currentSelection}`, { IsBlacklisted: true })
            .then((response) => {
                console.log(response);
                console.log(response.data);
                // this.renderControls(response.data);
            })
            .catch((e) => {
                console.log('Failed to Connecting to server and Fetch Data');
                console.log(e);
            });
        this.props.actions.updateBlacklistkSelectedTransaction(this.state.currentSelection, 'IsBlackListed');
    }

    render() {
        const page = this.getPage();
        console.log('render');
        return (
            this.props.transactionList.length > 0 ?
                (<div>
                    <h1><center>Ethereum Policy Pal</center></h1><br />
                    <span>
                        <input className="searchControl" placeholder="Search" onChange={this.searchList.bind(this)} />

                        <label className="filterLabel">Filter By: </label>
                        <select onChange={this.selectFilter.bind(this)}>
                            <option value={0} key={0} >Please Select: </option>
                            <option value={1} key={1} >Transaction Type </option>
                            <option value={2} key={2}>Status </option>
                        </select>
                        {this.state.filterKeyValues.length > 0 ? (
                            <select className="filterKeyValue" onChange={this.filterList.bind(this)}>
                                {this.populateFilterKeyValues()}
                            </select>) : <span />}
                        <button className="filterLabel" onClick={this.bookmarkTransaction.bind(this)}>Bookmark</button>
                        <button className="filterLabel" onClick={this.blacklistTransaction.bind(this)}>BlackList</button>

                    </span>

                    <br />
                    <div>
                        <table id="transaction">
                            <colgroup>
                                <col span="1" style={{ width: '15%' }} />

                            </colgroup>
                            <thead>

                                <tr>
                                    <th />
                                    <th>TxHash</th>
                                    <th>Block</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>TxReceiptStatus</th>
                                    <th>Age</th>
                                    <th>TxType</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTransactions(page.transactions)}
                            </tbody>
                        </table>
                    </div>
                    {this.pager(page)}
                 </div>) : (<div><h1>Loading.....</h1></div>)
        );
    }
}

function mapStateToProps(state) {
    return {
        transactionList: state.transactionList,
        selectedTransaction: state.selectedTransaction,
        updateList: state.updateList,
        hashValue: '',
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

MainComponent.propTypes = {
    updateList: PropTypes.arrayOf(PropTypes.shape({
        blockHash: PropTypes.string,
        blockNumber: PropTypes.string,
        confirmations: PropTypes.string,
        contractAddress: PropTypes.string,
        cumulativeGasUsed: PropTypes.string,
        from: PropTypes.string,
        gas: PropTypes.string,
        gasPrice: PropTypes.string,
        gasUsed: PropTypes.string,
        hash: PropTypes.string,
        input: PropTypes.string,
        isError: PropTypes.string,
        nonce: PropTypes.string,
        timeStamp: PropTypes.number,
        to: PropTypes.string,
        transactionIndex: PropTypes.string,
        txreceipt_status: PropTypes.string,
        value: PropTypes.string,
    })),
    transactionList: PropTypes.arrayOf(PropTypes.shape({
        blockHash: PropTypes.string,
        blockNumber: PropTypes.string,
        confirmations: PropTypes.string,
        contractAddress: PropTypes.string,
        cumulativeGasUsed: PropTypes.string,
        from: PropTypes.string,
        gas: PropTypes.string,
        gasPrice: PropTypes.string,
        gasUsed: PropTypes.string,
        hash: PropTypes.string,
        input: PropTypes.string,
        isError: PropTypes.string,
        nonce: PropTypes.string,
        timeStamp: PropTypes.number,
        to: PropTypes.string,
        transactionIndex: PropTypes.string,
        txreceipt_status: PropTypes.string,
        value: PropTypes.string,
    })),
    addTransactions: PropTypes.func,
    updateTransactions: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
