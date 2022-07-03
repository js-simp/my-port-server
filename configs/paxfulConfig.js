const dotenv = require('dotenv');
dotenv.config();

module.exports.getConfig = () => {
    const config = {
        clientId: process.env.PAXFUL_CLIENT_ID,
        clientSecret: process.env.PAXFUL_API_SECRET,
        serverPort: process.env.SERVER_PORT || 3000
    }

    if (!config.clientId || !config.clientSecret) {
        const error = [
            'Either "PAXFUL_CLIENT_ID" and/or "PAXFUL_API_SECRET" is not defined.',
            'You can get client id and secret by creating an application on developers portal',
            '(https://developers.paxful.com)'
        ];

        throw new Error(error.join(' '));
    }

    return config;
}