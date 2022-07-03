const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const client = require('../db');

//allocate environment variables
const DB = process.env.MY_PORT_DB_NS;

const db = client.db(DB); //access database
const col = db.collection('accounts') //access accounts collection
const sess = db.collection('sessions')
module.exports = function(passport){
  passport.use(
    new LocalStrategy(function verify(username, password, cb) {
      col.findOne({username : username}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false, { message: 'Incorrect username or password.', success : false }); }
    
        bcrypt.compare(password, user.password, function(err, result) {
            console.log(result);
          if (err) { return cb(err); }
          if (result !== true) {
            return cb(null, false, { message: 'Incorrect username or password.', success : false });
          }
          return cb(null, user, { message: 'Successfully authenticated!', success : true });
        });
      });
      passport.serializeUser(function(user, done) {
        process.nextTick(function() {
          done(null, { id: user._id, username: user.username });
        });
      }) 
    
      passport.deserializeUser(function(user, cb) {
        console.log(user)
        col.findById(user.id)
        .then((user)=> {
          cb(null, user);
      })
        .catch((err) => {
          cb(err)
        })
      }); 
    }))
  
}
