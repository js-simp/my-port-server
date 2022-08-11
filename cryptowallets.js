//here will be the code using etherscan for availalbe wallet addresses
const express = require('express')
const router = express.Router();

const https = require('https');

const options = {
  hostname: 'api.etherscan.io',
  port: 443,
  path: '/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=1H2HWKXDRZMP2ZAX15XEDZ4827I5M95I1F',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

router.use('/', (req,res) => {
  const Req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  
  Req.on('error', (e) => {
    console.error(e);
  });
  Req.end();
})



module.exports = router