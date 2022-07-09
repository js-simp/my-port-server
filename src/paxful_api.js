const client = require('../db');
const { default: usePaxful } = require("@paxful/sdk-js");

//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;



//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('paxful') //access accounts collection

const getUser = (userId) => {
    col.findOne({'userId' : userId}, (err, user) => {
        if(err){
            console.log(err)
        }
        if(!user){
            console.log("Credentials not found")
        }
        // console.log(user.credentials)
        return user.credentials? user.credentials : null;
    })
}


// In real word application you should consider using a database to store
// credentials
class JsonCredentialsStorage {
    constructor(userId) {
        this.user = userId;
        this.Cred = '';
    }
    saveCredentials(credentials) {
        this.Cred = credentials;
        console.log('Saving credentials for : ', this.user)
        let paxUser = {
            "userId" : this.user,
            "credentials" : credentials

        }
        const p = col.insertOne(paxUser);      
    }

    getCredentials() {
        console.log("Finding for user with ID", this.user)
       
        const userCredentials = getUser(this.user)
        return userCredentials? userCredentials : this.Cred;
    }
};

module.exports.invokeOrDie = async (paxfulSdk, endpoint, params = {}) => {
    const response = await paxfulSdk.invoke(endpoint, params);
    if (response['error']) {
        return Promise.reject(`Error occurred when invoking '${endpoint}'. ${response.error}: ${response.error_description}`);
    }

    return Promise.resolve(response);
}

module.exports.createPaxfulApi = (config, userId) => {
    return usePaxful(config, new JsonCredentialsStorage(userId));
};