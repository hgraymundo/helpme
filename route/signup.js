var Account = require('../models').account;
var cerrors = require('../helpers/custom-errors');

module.exports = function(app) {

  app.get('/signup', (req, res) => {
    res.render('./signup/signup');
  })

  app.post('/signup', (req, res) => {
    let messages = [];
    req.checkBody("email", 'Email is required').isEmail().withMessage("E-mail not valid");
    req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase and one number.');
    req.checkBody("confirm_password","The confirmation of the password does not match the password").equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
      let e = cerrors.getErrors(errors, "default");
      res.render('./signup/signup', { errors: e });
    }
    else { //not errors
      let { email, password } = req.body;
      Account.create({ email, password})
      .then( result => {
        messages.push({ message: 'Account successfully created' })
        res.render('./signup/signup', { messages: messages });
      })
      .catch( err => {
        let e = cerrors.getErrors(err);
        console.log(err);
        res.render('./signup/signup', { errors: e });
      })
    }
  })

}
