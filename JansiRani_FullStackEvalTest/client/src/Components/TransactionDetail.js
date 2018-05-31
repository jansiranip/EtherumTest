import PropTypes from 'prop-types';
import actions from '../redux/actions';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Web3 from 'web3';

let web3 = new Web3();
console.log('No Web3 Detected... using HTTP Provider');
web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/PF866njwnchxjDmF9lpy'));


class TransationDetail extends Component {
    constructor(props) {
        super(props);
        console.log('BLOCK CONSTRUCTOR');
        this.state = {
            transactionDetails: {},
        };
    }
    componentDidMount() {
        /* const transactionDetailHistory = this.props.selectedTransaction;
        this.setState({
            transactionDetailHistory,
        }); */
    }
    // Wrapper for Web3 callback
    promisify = inner =>
        new Promise((resolve, reject) =>
            inner((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            }));

    async getTransactionDetails(txHash) {
        const transactionDetailsPromise =  this.promisify(cb => web3.eth.getTransaction(txHash, cb));
        const transactionDetailsReceiptPromise =  this.promisify(cb => web3.eth.getTransactionReceipt(txHash, cb));
        const results=await Promise.all([transactionDetailsPromise,transactionDetailsReceiptPromise]);
        console.log(results);
        if (results.length > 0) {
            const transactionDetails = results[0];
            console.log(transactionDetails);
            this.setState({
                transactionDetails,
            });
        }
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
            return `approximately ${Math.round(elapsed / msPerDay)} days ago`;
        } else if (elapsed < msPerYear) {
            return `approximately ${Math.round(elapsed / msPerMonth)} months ago`;
        }


        return `approximately ${Math.round(elapsed / msPerYear)} years ago`;
    }
    getTransaction() {
        console.log(this.props);
        if (Object.keys(this.state.transactionDetails).length == 0) {
            this.getTransactionDetails(this.props.params.transactionHash);
        } else {
            const transactionDetailHistory = this.state.transactionDetails;
            console.log(JSON.stringify(transactionDetailHistory.input));
            return (<div className="container">
                <h2 align="center">Transaction Details</h2>
                <table id="transaction" align="center">
                    <tbody>
                        <tr>
                            <td>TxHash:</td>
                            <td>{transactionDetailHistory.hash} </td>

                        </tr>

                        <tr>
                            <td>Block Height</td>
                            <td>{`${transactionDetailHistory.blockNumber}`} </td>

                        </tr>

                        <tr>
                            <td>From</td>
                            <td>{transactionDetailHistory.from} </td>

                        </tr>
                        <tr>
                            <td>To</td>
                            <td>{transactionDetailHistory.to} </td>

                        </tr>
                        <tr>
                            <td>Value</td>
                            <td>{`${transactionDetailHistory.value} Ether`}</td>

                        </tr>
                        <tr>
                            <td>Gas Limit</td>
                            <td>{transactionDetailHistory.gas} </td>

                        </tr>

                        <tr>
                            <td>Gas Price</td>
                            <td>{`${transactionDetailHistory.gasPrice / 1000000000000000000} Ether (${transactionDetailHistory.gasPrice / 1000000000} Gwei)`}</td>

                        </tr>

                        <tr>
                            <td>Nonce</td>
                            <td>{transactionDetailHistory.nonce} </td>

                        </tr>
                        <tr>
                            <td>Input </td>
                            <td rowSpan="2"><pre>{`METHOD ID: ${JSON.stringify(transactionDetailHistory.input).slice(1,11)} \n[0]: ${JSON.stringify(transactionDetailHistory.input).slice(12,75)} \n[1]: ${JSON.stringify(transactionDetailHistory.input).slice(76, 139) }\n `}</pre></td>

                        </tr>
                    </tbody>

                </table>
            </div>);
        }
    }
    render() {
        const transactionDetailHistory = this.props.selectedTransaction;
        console.log(transactionDetailHistory);
        return (

            (Object.keys(this.props.selectedTransaction).length != 0)?
                (<div className="container" align="center">
                    <h2 align="center">Transaction Details</h2>
                    <table id="transaction">
                        <tbody>
                            <tr>
                                <td>TxHash:</td>
                                <td>{transactionDetailHistory.hash} </td>

                            </tr>
                            <tr>
                                <td>TxReceipt Status</td>
                                <td>{transactionDetailHistory.txreceipt_status > 0 ? 'Success' : 'Failure' } </td>

                            </tr>
                            <tr>
                                <td>Block Height</td>
                                <td>{`${transactionDetailHistory.blockNumber} (${transactionDetailHistory.confirmations} block confirmations)`} </td>

                            </tr>
                            <tr>
                                <td>TimeStamp</td>
                                <td>{`${this.timeDifference(new Date(), new Date(transactionDetailHistory.timeStamp * 1000))} (${new Date(transactionDetailHistory.timeStamp * 1000)})`}</td>

                            </tr>
                            <tr>
                                <td>From</td>
                                <td>{transactionDetailHistory.from} </td>

                            </tr>
                            <tr>
                                <td>To</td>
                                <td>{transactionDetailHistory.to} </td>

                            </tr>
                            <tr>
                                <td>Value</td>
                                <td>{`${transactionDetailHistory.value} Ether`}</td>

                            </tr>
                            <tr>
                                <td>Gas Limit</td>
                                <td>{transactionDetailHistory.gas} </td>

                            </tr>
                            <tr>
                                <td>Gas Used By Txn</td>
                                <td>{transactionDetailHistory.gasUsed} </td>

                            </tr>
                            <tr>
                                <td>Gas Price</td>
                                <td>{`${transactionDetailHistory.gasPrice / 1000000000000000000} Ether (${transactionDetailHistory.gasPrice / 1000000000} Gwei)`}</td>

                            </tr>
                            <tr>
                                <td>Actual Tx Cost/Fee</td>
                                <td>{`${(transactionDetailHistory.gasPrice / 1000000000000000000) * transactionDetailHistory.gasUsed} Ether`}  </td>

                            </tr>
                            <tr>
                                <td>Nonce</td>
                                <td>{transactionDetailHistory.nonce} </td>

                            </tr>
                            <tr>
                                <td>Input </td>
                                <td rowSpan="2"><pre>{`METHOD ID: ${JSON.stringify(transactionDetailHistory.input).slice(1,11)} \n[0]: ${JSON.stringify(transactionDetailHistory.input).slice(12,75)} \n[1]: ${JSON.stringify(transactionDetailHistory.input).slice(76 ,139) }\n `}</pre></td>

                            </tr>
                        </tbody>

                    </table>
                </div>) : <div>{this.getTransaction()}</div>
        );
    }
}


TransationDetail.propTypes = {

};

function mapStateToProps(state) {
    return {
        transactionList: state.transactionList,
        selectedTransaction: state.selectedTransaction,
        updateList: state.updateList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

TransationDetail.propTypes = {
};
export default connect(mapStateToProps, mapDispatchToProps)(TransationDetail);

