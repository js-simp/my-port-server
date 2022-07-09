const express = require('express')
const router = express.Router();
const { getConfig } = require('./configs/paxfulConfig');
const { createPaxfulApi } = require('./src/paxful_api');
const dotenv = require('dotenv')

dotenv.config();

const config = getConfig();


// Savings original raw body, needed for Paxful webhook signature checking
router.use(function(req, res, next) {
    req.rawBody = '';

    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });

    next();
});

router.use(function(req, res, next) {
    if (!req.session.userId) {
        // req.session.userId = uuidv4();
        req.session.userId = req.user.id;//added for testing
        req.session.isAuthenticated = false;
        req.session.user = null;
    }
    console.log("Your paxful ID is", req.session.userId)

    req.context = {
        services: {
            createPaxfulApi: () => {
                // Depending on who's authorized a different instance of SDK is going to be created. Each
                // instance is associated with credentials specific for currently authenticated user
                return createPaxfulApi({
                    ...config,
                    redirectUri: `http://localhost:${config.serverPort}/${req.user.username}/paxful/auth/callback`,
                    scope: ['profile', 'email', 'paxful:wallet:balance', 'paxful:transactions:all']
                }, req.session.userId);
            }
        },
        config: config
    };

    next();
});

router.use('/',  require('./src/routes') )

module.exports = router;