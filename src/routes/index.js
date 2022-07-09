const express = require('express');

const routerAggregator = express.Router();
routerAggregator.use(require('./paxful'));

module.exports = routerAggregator;