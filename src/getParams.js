const express = require('express');
const { invokeOrDie } = require('./paxful_api');
const dotenv = require('dotenv')
const client = require('../db.js')


dotenv.config()
//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;

//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('assets') //access accounts collection

module.exports.getParams = async (userId, paxfulSdk) => {
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

    // return params
    const p = await col.updateOne({_id : userId}, {$set : {paxful :params}}, {upsert : true})
};
