const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passport_local = require('passport-local');
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config();

const app = express()
const origin = process.env.ORIGIN_SERVER_DEV


//Middlware
app.use(express.json());
app.use(cors({
    origin : origin,
    credentials : true,
}
));


module.exports = app;