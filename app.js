const app = require('./server.js')
const dotenv = require('dotenv')
const client = require('./db')
const bcrypt = require('bcrypt')
const passport = require('passport')


dotenv.config();


//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;

//middleware for passport
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)


//access mongodb cluster database
const db = client.db(DB); //access database
const col = db.collection('accounts') //access accounts collection


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

app.post('/register', (req,res) => {
    console.log(req.body)
    addUser(req.body, res);
})

app.post('/login', (req,res,next) => {
    passport.authenticate('local', (err, user, info)=> {
        if(err) {throw err};
        if(!user) {res.send('User does not exist')}
        else{
            res.send('Successfully authenticated!')
            
        }
    })(req,res,next);
})
