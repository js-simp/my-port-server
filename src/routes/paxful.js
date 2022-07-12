const express = require('express')
const router = express.Router();
const {getParams} = require('../getParams') 


router.get('/auth', (req, res) => {
    req.context.services.createPaxfulApi().login(res);
});

router.get('/auth/callback', async (req, res, next) => {
    let paxfulApi = ''
    try {
            paxfulApi = req.context.services.createPaxfulApi();

            await paxfulApi.impersonatedCredentials(req.query.code);
            console.log(req.query.code)
            req.session.isAuthenticated = true;
            // req.session.user = await paxfulApi.getProfile();
        } catch (e) {
            console.warn(e);
        }
    if(req.session.isAuthenticated){
       const params = await getParams(req.session.userId, paxfulApi)
       console.log(params)
    }
    res.send("<script>window.opener.postMessage('Successfully saved your credentials', 'http://localhost:3000')</script>")
});

module.exports = router;


