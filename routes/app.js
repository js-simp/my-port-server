const dotenv = require('dotenv')
const client = require('../db')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const passport = require('passport')

dotenv.config();


//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;


//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('accounts') //access accounts collection

//middleware for passport
router.use(passport.initialize())
router.use(passport.session())
require('../configs/passportConfig')(passport)



//-----------Registration of new user function ------------------
async function addUser(info, res) {
    
    try {
        
        //check if username is already availble (already registered?)
        const existing = await col.findOne({username : info.username})
        if(existing) {
            res.send("User already exists")
        }
        if(!existing){
            //hash the sent password
            const hashedPassword = await bcrypt.hash(info.password, 10)
            // Construct a new document                                                                                                                                                        
            let newUser = {
                "username": info.username,
                "password" : hashedPassword,
            }
            // Insert a single document, wait for promise so we can read it back
            const p = await col.insertOne(newUser);
            res.send("Successfully added new user")
        }
    } 
    catch (err) {
        console.log(err.stack);
    }
}

//HANDLING REGISTER AND LOGIN REQUESTS FROM CLIENT

router.post('/register', (req,res) => {
    console.log(req.body)
    addUser(req.body, res);
})

router.post('/login',(req, res, next) => { 
    passport.authenticate('local',
        (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.send(info)
        }

        req.logIn(user, function(err) {
            if (err) {
            return next(err);
            }

            res.send(info)
        });

        })(req, res, next);
})



//handling paxful account delegate access for user
router.get('/:user/paxful', (req,res,next) => {
    console.log('get paxful info!')
    console.log(req.isAuthenticated())
})


module.exports = router;