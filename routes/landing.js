const express = require('express');
const router = express.Router();
const { invokeOrDie } = require('../paxful_api');

router.get('/', async (req, res) => {
    const params = {
        isAuthenticated: req.session.isAuthenticated,
        user: req.session.user,
        balance: null
    };

    if (req.session.isAuthenticated) {
        const paxfulSdk = req.context.services.createPaxfulApi();

        const balanceResponse = await invokeOrDie(paxfulSdk, '/paxful/v1/wallet/balance');
        params.balance = {
            amount: balanceResponse.data.balance,
            crypto: balanceResponse.data.crypto_currency_code
        }

        const transactionsResponse = await invokeOrDie(paxfulSdk, '/paxful/v1/transactions/all', {
            type: 'trade'
        });

        params.transactions = transactionsResponse.data.transactions.filter((tx) => 'Escrow release' === tx.type);
    }

    console.log(params)
    res.send(params);
});

module.exports = router;