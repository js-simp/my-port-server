const express = require('express');
// const router = express.Router();
const { invokeOrDie } = require('./paxful_api');

module.exports.getParams = async (paxfulSdk) => {
    // console.log('trying to get it right!' , req.session) //testing
    // console.log(req.context.services)
    const params = {
        balance: null
    };

        const balanceResponse = await invokeOrDie(paxfulSdk, '/paxful/v1/wallet/balance');
        params.balance = {
            amount: balanceResponse.data.balance,
            crypto: balanceResponse.data.crypto_currency_code
        }

        const transactionsResponse = await invokeOrDie(paxfulSdk, '/paxful/v1/transactions/all', {
            type: 'trade'
        });

        params.transactions = transactionsResponse.data.transactions.filter((tx) => 'Escrow release' === tx.type);

    // res.render('index', params);
    // res.send(params)
    // return params
    return params
};
