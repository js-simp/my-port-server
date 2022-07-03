const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv')
const cors = require('cors');
const routes = require('./routes/app')
const client = require('./db')
const MongoStore = require('connect-mongo')

dotenv.config();

const app = express()
const origin = process.env.ORIGIN_SERVER_DEV
const PORT = process.env.PORT || 5000;
//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;


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

app.use(routes)

//-------------------END OF MIDDLEWARE---------------------------

//start listening on port
app.listen(PORT, () => {
    console.log(`Listening on port ... ${PORT}`)
})
