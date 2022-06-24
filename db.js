const {MongoClient} = require('mongodb')
const dotenv = require('dotenv');

dotenv.config();

const URI = process.env.MY_PORT_DB_URI

//create mongodb client
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
    console.log('Connected to Mongoose database')
})

module.exports = client;