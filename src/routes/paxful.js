const express = require('express')
const router = express.Router();


router.get('/auth', (req, res) => {
    req.context.services.createPaxfulApi().login(res);
});

router.get('/auth/callback', async (req, res, next) => {

   try {
        const paxfulApi = req.context.services.createPaxfulApi();

        await paxfulApi.impersonatedCredentials(req.query.code);
        req.session.isAuthenticated = true;
        req.session.user = await paxfulApi.getProfile();
    } catch (e) {
        console.warn(e);
    }
    res.send("<script>window.opener.postMessage('Successfully saved your credentials', 'http://localhost:3000')</script>")
});

module.exports = router;


