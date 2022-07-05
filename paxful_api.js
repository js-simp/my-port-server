const client = require('./db');
const { default: usePaxful } = require("@paxful/sdk-js");

//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;


//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('paxful') //access accounts collection

// In real word application you should consider using a database to store
// credentials
class JsonCredentialsStorage {
    constructor(userId) {
        this.user = userId;
    }

    async saveCredentials(credentials) {
        let paxUser = {
            "userId" : this.user,
            "credentials" : credentials

        }
        const p = await col.insertOne(paxUser);
    }

    async getCredentials() {
        const existing = await col.findOne({"userId" : this.user})
        console.log(existing)
        return existing ? existing.credentials : null;
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