const {default : usePaxful} = require('@paxful/sdk-js')

//direct access works
//for delegat access what are the steps?

async function load() {
    const paxfulApi = usePaxful({
        clientId: 'jJGQRHfvSO2cHFNPSSB4TXHcxmupBcyYmJ41kUVJifwCQEsf',
        clientSecret: 'X61Wndq94jaWeegUQ6fBBCTtX32YuQuqSNrHru0DIsSpKXmE',
    });


    const myTransactions = await paxfulApi.invoke("/paxful/v1/transactions/all", { type: 'trade' });

    console.log(myTransactions);
    const data = myTransactions.data.transactions;
    data.forEach(element => {
        console.log(element)
    });
} 
