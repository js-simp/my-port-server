const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config();

const app = express()
const origin = process.env.ORIGIN_SERVER_DEV
const PORT = process.env.PORT || 5000;


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
    }
))

//-------------------END OF MIDDLEWARE---------------------------

//start listening on port
app.listen(PORT, () => {
    console.log(`Listening on port ... ${PORT}`)
})


module.exports = app;