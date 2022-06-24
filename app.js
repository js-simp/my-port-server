const express = require('express');
const app = require('./server.js')
const dotenv = require('dotenv')
const {MongoClient} = require('mongodb')
const bcrypt = require('bcrypt')

const User = require('./user_info')

dotenv.config();

const PORT = process.env.PORT || 5000;
const URI = process.env.MY_PORT_DB_URI
const DB = process.env.MY_PORT_DB_NS;

const client = new MongoClient(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
//connect to mongoose database
client.connect()
.catch(err => {
    console.error(err.stack);
    process.exit(1);
})
.then(async client => {
    app.listen(PORT, () => {
        console.log(`Listening on port ... ${PORT}`)
    })
})

const db = client.db(DB);
const col = db.collection('accounts')

async function addUser(info) {
    
    try {
        // Construct a document                                                                                                                                                              
        let newUser = {
            "username": info.username,
            "password" : info.password,
        }
        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(newUser);
        // Find one document
    } 
    catch (err) {
        console.log(err.stack);
    }
}


app.post('/register', (req,res) => {
    console.log(req.body)
    addUser(req.body);
})

app.post('/login', (req,res) => {
    console.log(req.body)
})