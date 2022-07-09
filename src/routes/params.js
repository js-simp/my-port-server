const express = require('express')
const router = express.Router();

router.get('/auth/paxful/params', (req, res, next) => {
    const userParams = req.session.params;
    // res.send(userParams)

})

module.exports = router;