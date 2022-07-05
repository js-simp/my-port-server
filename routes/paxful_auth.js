const express = require('express');
const router = express.Router();
const { getConfig } = require('../configs/paxfulConfig');
const { v4: uuidv4 } = require('uuid');
const { createPaxfulApi } = require('../paxful_api');
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
        req.session.userId = uuidv4();
        req.session.isAuthenticated = false;
        req.session.user = null;
    }

    req.context = {
        services: {
            createPaxfulApi: () => {
                // Depending on who's authorized a different instance of SDK is going to be created. Each
                // instance is associated with credentials specific for currently authenticated user
                return createPaxfulApi({
                    ...config,
                    redirectUri: `http://localhost:${config.serverPort}/auth/paxful/callback`,
                    scope: ['profile', 'email', 'paxful:wallet:balance', 'paxful:transactions:all']
                }, req.session.userId);
            }
        },
        config: config
    };

    next();
});

// router.get('/', (req,res,next) => {
//     console.log(req.isAuthenticated())
// })

router.get('/auth/paxful', (req, res, next) => {
    req.context.services.createPaxfulApi().login(res);
});

router.get('/auth/paxful/callback', async (req, res, next) => {
    try {
        const paxfulApi = req.context.services.createPaxfulApi();

        await paxfulApi.impersonatedCredentials(req.query.code);
        req.session.isAuthenticated = true;
        req.session.user = await paxfulApi.getProfile();
    } catch (e) {
        console.warn(e);
    }

    res.redirect("/");
});

module.exports = router;