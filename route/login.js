var cerrors = require('../helpers/custom-errors');
var passport = require('passport');


module.exports = function(app) {

  app.get('/login', (req, res) => {
    res.render('./login/login');
  })

  app.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, done) =>{
      if(err) {
        console.log(err)
      } else {
        if(!user) {
          let e = [{ message: 'here is a problem with your username or password'}]
          res.render('./login/login', { errors: e })
        } else {
          req.login(user, function(err) {
            if (err) { return next(err); }
            res.redirect('/alerts');
          });
        }
      }
    })(req, res, next);
  })

  //  passport.authenticate("local", (err, user, done) =>{
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     if(!user) {
  //       let e = [{ message: 'here is a problem with your username or password'}]
  //       res.render('.login/login', { errors: e })
  //     } else {
  //       req.login(user, function(err) {
  //         if (err) { return next(err); }
  //         return res.redirect('/dashboard');
  //       });
  //     }
  //   }
  // }),(req, res, next) => {
  //   console.log("LOGIN")
  // })

  app.get('/logout', (req, res) => { 
    // res.json("logout")
    req.session.destroy(function(err) {
      console.log(err);
    })
    req.logout();
    res.redirect('/login');
  })
    
}
