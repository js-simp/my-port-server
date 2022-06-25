const {default : usePaxful} = require('@paxful/sdk-js')
const dotenv = require('dotenv');

dotenv.config();

//direct access works
//for delegat access what are the steps?

async function load() {
    const paxfulApi = usePaxful({
        clientId: process.env.local.CLIENT_ID, //ADD CREDENTIALS FROM PAXFUL INTO .env.local
        clientSecret: process.env.local.CLIENT_SECRET,
    });


    const myTransactions = await paxfulApi.invoke("/paxful/v1/transactions/all", { type: 'trade' });

    console.log(myTransactions);
    const data = myTransactions.data.transactions;
    data.forEach(element => {
        console.log(element)
    });
} 
