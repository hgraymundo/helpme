var Account = require('../models').account;
var cerrors = require('../function/custom-errors');

module.exports = function(app) {
  /*
    curp:
    rfc:
    password:  1 Mayuscula, 1 Numero, 1 special character Min 8 characters, Max 15 characters
    repeat_password: Compare same string as repeat_password.
    birthday: in format yyyy-mm-dd
    phone: 01-000-0000000
           01-272-1472103
    cellphone: 000-000-0000000
    hour: hh:00

    trim() trims characters (whitespace by default) at the beginning and at the end of a string
    escape() replaces <, >, &, ', " and / with their corresponding HTML entities
  */

  app.post('/validations', (req, res) => {
    console.log( req.body )
    req.checkBody("email", 'Email is required').isEmail().withMessage("E-mail not valid");
    req.checkBody("firstname", 'Firstname is required, 3 characters minimum').notEmpty().isLength({ min: 3 }).trim().escape();
    //more strong
    req.checkBody("birthday").matches(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).withMessage('The birthday field require the next format: YYYY-MM-DD');
    //req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase, one number and one special character.');
    req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase and one number.');
    req.checkBody("confirm_password","The confirmation of the password does not match the password").equals(req.body.password);
    req.checkBody("telephone").matches(/^01-\d{3}-\d{7}$/).trim().withMessage("The format of the telephone field is: 01-###-#######");
    req.checkBody("cellphone").matches(/^\d{3}-\d{3}-\d{7}$/).trim().withMessage("The format of the cellphone field is: ###-###-#######");
    req.checkBody("hour").matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).trim().withMessage("The format of the hour field is : ##:## , 24hrs format");
    var errors = req.validationErrors();
    if(errors){
      let e = cerrors.getErrors(errors, "default");
      res.json({ errors: e });
    }
    else { //not errors
     res.json( req.body);
    }
  })
// CREATE
  app.post('/account/new', (req, res) => {
    let { email, password } = req.body;
    Account.create({
      email,
      password
    }).then ( result => {
      res.json({ result });
    }).catch( err =>{
      let e = cerrors.getErrors(err);
      res.json({ errors: e });
    })
  })
//READ ALL
  app.get('/accounts', (req, res) => {
    Account.findAll( { attributes: { exclude: ['password'] } } ).then( result => {
      res.json( result );
    }) .catch( err => {
      let e = cerrors.err();
      res.json({ errors: e })
    })
  })
//READ ONE by id, you can change the filter.
  app.get('/account/:id', (req, res) => {
    Account.findByPk(req.params.id , { attributes: { exclude: ['password'] } })
    .then( result => { res.json(result) }).catch( err => { res.json( err ) })
  })
// UPDATE
  app.put('/account/:id', (req, res) => {
    let { email } = req.body;
    let id = req.params.id;
    Account.findByPk(req.params.id)
    .then( account => {
      return account.update({ email })
      .then(()=> res.json( account ))
      .catch( err => {
        let e = cerrors.err();
        res.json({ errors: e })
      })
    })
    .catch( err => {
      res.json( err );
    })
  })
//
  app.delete('/account/:id', (req, res) => {
    Account.destroy({ where: { uuid: req.params.id } })
    .then( result => {
      res.json( result );
    })
    .catch( err => {
      let e = cerrors.err();
      res.json({ errors: e })
    })
  })
}
