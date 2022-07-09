const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv')
const cors = require('cors');
const client = require('./db')
const MongoStore = require('connect-mongo')

const passport = require('passport')

dotenv.config();

const app = express()
const origin = process.env.ORIGIN_SERVER_DEV
const PORT = process.env.PORT || 5000;
//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;

//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('accounts') //access accounts collection



//Middlware
app.use(express.json());
app.use(cors({
    origin : origin,
    credentials : true,
}
));
app.use(session(
    {
        secret: 'secretcode',
        resave: true,
        saveUninitialized: true,
        store : MongoStore.create({
            client : client,
            dbName: DB
        })
    }
))

//middleware for passport
app.use(passport.initialize())
app.use(passport.session())
require('./configs/passportConfig')(passport)

app.use('/', require('./auth'))
//-------------------END OF MIDDLEWARE---------------------------



//start listening on port
app.listen(PORT, () => {
    console.log(`Listening on port ... ${PORT}`)
})
