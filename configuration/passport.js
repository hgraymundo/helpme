var Account = require('../models').account;
var bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

  passport.serializeUser(function (user, cb) {
    console.log("Serializando");
    console.log(user);
      cb(null, user);
  });

  passport.deserializeUser(function (user, cb) {
    console.log("deserialize");
    console.log(user);
    Account.findOne({ where: { uuid: user.user_id }})
    .then( result => {
      console.log(result)
      cb(null, user);
    })
    .catch( err => {
      cb(null, err);
    })
  });

  passport.use(new LocalStrategy (
    function(email, password, done) {
      console.log('IN PASSPORT');
      Account.findOne({ where: { email: email, status: 'Active' } })
        .then(function(user) {
          console.log('IN USER FIND');
          console.log(user);
            if(user) {
              var confirm = bcrypt.compareSync(password, user.password);
              console.log('VALIDATE PASSWORD');
              console.log(confirm);
              if(confirm) {
                var user = user.dataValues
                delete user['password'];
                var data = {
                  user_id: user.uuid,
                }
                done(null, data)
              } else {
                console.log("PASSWORD NO VALID");
                  return done(null, false);
              }
            } else {
              console.log("NO FIND USER");
              return done(null, false);
            }
        })
        .catch(error => {
          console.log(error);
        });
    })
  );

}
