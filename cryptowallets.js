//here will be the code using etherscan for availalbe wallet addresses
const express = require('express')
const router = express.Router();
const client = require('./db')
const https = require('https');
const dotenv = require('dotenv')

//sample bitcoin addresses [3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64, 3645N22DDswRxV4BQGbuBrgHCAYUmzcHU6 , 19G5kkYvjawZiYKhFeh8WmfBN31pdP94Jr]
//sample ethereum addrsses [0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a, 0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67]

dotenv.config()
//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;

const db = client.db(DB); //access database
const col = db.collection('assets') //access accounts collection

const etherscanAPI = 'api.etherscan.io'
const etherKey = process.env.ETHER_KEY;
const bitcoinApi = 'blockchain.info'

//options placeholder
let options = {
  hostname: '',
  port: 443,
  path: '',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

async function getAssets(req) {
  let allAssets = await col.findOne({user : req.session.passport.user.username})
  console.log(allAssets)
  return allAssets
}

router.use('/newAddress', (req,res) => {
  //retrieve user info
  const user = req.session.passport.user.username;
  const user_id = req.session.passport.user.id;

  //obtain the new address to be added
  // console.log(req.body)
  const address = req.body.address;
  const tokenType = req.body.tokenType;
  //check if address is valid

  //add new address to asset collection -> crypto array
  col.updateOne(
    { user: user },
    { $push: { cryptoAddresses: {address : address , token : tokenType }} }
 )

 res.send('New Crypto Address has been added succesfully!')
})

router.use('/', async (req,res) => {
  //-----------------get all assets for user-------------------------
  let allAssets = await getAssets(req);
    // expected output: "resolved"
  
  let ethAddresses = ''
  let bitAddresses = ''
  //-----------------get addresses from database----------------------
  let cryptoAddresses = allAssets.cryptoAddresses;

  cryptoAddresses.forEach(item => {
    if(item.token == 'Ethereum'){
      if(ethAddresses == ''){
        ethAddresses = ethAddresses + item.address;
      }
      else{
        ethAddresses = ethAddresses + ',' + item.address;
      }
    }
    if(item.token == 'Bitcoin'){
      if(bitAddresses == ''){
        bitAddresses = bitAddresses  + item.address;
      }
      else{
        bitAddresses = bitAddresses + '|' + item.address;
      }     
    }
  });
  // console.log(ethAddresses, bitAddresses)
  //---------------create options-------------------------------
  let etherpath = '/api?module=account&action=balancemulti&address='+ ethAddresses +'&tag=latest&apikey=' + etherKey
  let bitpath = '/balance?active=' + bitAddresses
  // console.log(etherpath, bitpath)
  
  allOptions = []
  if(ethAddresses != ''){
    let ethOptions = {...options}
    ethOptions.hostname = etherscanAPI; ethOptions.path = etherpath;
    allOptions.push(ethOptions)
  }

  if(bitAddresses != ''){
    let bitOptions = {...options};
    bitOptions.hostname = bitcoinApi; bitOptions.path = bitpath;
    allOptions.push(bitOptions)
  }

  // console.log(allOptions)
  //--------------create request based on token type---------------
  allOptions.forEach(options => {
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
  });
})


module.exports = router