var Alert = require('../models').alert;
var User = require('../models').user;

module.exports = function(app) {

  app.get('/dashboard', isLoggedIn, (req, res) => {
    console.log(req.session)
    res.render('./dashboard/dashboard');
  })

  app.get('/alerts', isLoggedIn, (req, res) => {
    console.log(req.session)
    Alert.findAll({  include: {
      model: User
    }})
    .then ( result => {
      console.log(result)
      res.render('./alert/list', { result });
    })
    .catch( err => {

    })
  })

  app.get('/attend/:uuid', (req, res) => {
    Alert.findOne({ where: { uuid: req.params.uuid }, include: [ { model: User }]})
     .then( result => {
       console.log(result);
       res.render('./alert/details', { result })
     })
     .catch( err => {
       console.log(err);
     })
    
  })

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    console.log(req.isAuthenticated())
    res.redirect('/login');
  }

}
