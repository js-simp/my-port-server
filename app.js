const express = require('express');
const app = require('./server.js')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config();

const PORT = process.env.PORT || 5000;
const URI = process.env.MY_PORT_DB_URI

//connect to mongoose database
mongoose.connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
})
.then(async client => {
    app.listen(PORT, () => {
        console.log(`Listening on port ... ${PORT}`)
    })
})

app.post('/register', (req,res) => {
    console.log(req.header)
})

app.post('/login', (req,res) => {
    console.log(req.header)
})