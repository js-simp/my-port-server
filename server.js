const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const passport_local = require('passport-local');
const dotenv = require('dotenv')
const cors = require('cors');


const app = express()


//Middlware
app.use(express.json());
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true,
}
));


module.exports = app;